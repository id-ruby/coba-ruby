cookieKeyLastChallengePath = (cookiePrefix+'cr_last_path')
if window.redirectToLastChallengePath
  lastPath = $.cookie cookieKeyLastChallengePath
  redirectPath = ""
  if lastPath?
    redirectPath = "tingkat/" + lastPath + ".html";
  else
    redirectPath = "tingkat/01/00.html";
  window.location.href += redirectPath;

# Extensions
unless String::trim then String::trim = -> @replace /^\s+|\s+$/g, ""
unless window.console and console.log
  (->
    noop = ->

    methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "markTimeline", "table", "time", "timeEnd", "timeStamp", "trace", "warn"]
    length = methods.length
    console = window.console = {}
    console[methods[length]] = noop  while length--
  )()



# History Support
HistorySupportAvailable = -> !!(window.history && history.pushState)



# Challenge
challengePath = ''
challengeAnswerable = false
challengeCapabilities = null
ChallengeInitialize = ->
  challengePath = ''
  challengeAnswerable = false
  $jsChallenge = $('#js-challenge')
  if $jsChallenge? && $jsChallenge.length > 0
    challengePath = $jsChallenge.data('path')
    challengeAnswerable = $jsChallenge.data('answerable')
    challengeCapabilities = $jsChallenge.data('capabilities')
    $b = $('body')
    $b.removeClass()
    $b.addClass challengeCapabilities.join('   ') if challengeCapabilities?
  $challengeCodePrefill = $ '#code-prefill'
  if $challengeCodePrefill? && $challengeCodePrefill.length > 0
    SnippetEditorSetValue $challengeCodePrefill.text().trim() + "\n# Ketik jawaban di bawah ini\n"
  if HistorySupportAvailable()
    $(".js-challenge-link").on 'click', ->
      ChallengeNavigateToURL $(this).attr('href')
      return false


popstateIsBoundToWindow = false
ChallengeNavigateToURL = (challengeURL) ->
  $.cookie cookieKeyLastChallengePath, challengePath, expires: 7, path: '/'

  if HistorySupportAvailable()
    unless popstateIsBoundToWindow
      popstateIsBoundToWindow = true
      $(window).on 'popstate', (e) ->
        ChallengeNavigateToURL window.location.href

    $.get challengeURL, {}, (data, textStatus, xhr) ->
      questionId = "#js-question"
      $question = $(questionId)
      ChallengeContentUpdate = ->
        $data = $(data)
        $question.html $data.find(questionId).html()
        ChallengeInitialize()
        history.pushState {}, $data.find('title').text(), challengeURL

      if $.support.transition
        $("#instruction-loading-placebo").fadeIn("fast")
        $question.transition opacity: 0, ->
          ChallengeContentUpdate()
          $question.transition opacity: 1
          $("#instruction-loading-placebo").fadeOut("fast")
      else
        $("#instruction-loading-placebo").fadeIn("fast")
        ChallengeContentUpdate()
        $("#instruction-loading-placebo").fadeOut("fast")
  else
    window.location.href = challengeURL

ChallengeNavigateToPath = (challengePath) ->
  ChallengeNavigateToURL [challengeRoot, challengePath].join('/') + ".html"



# Snippet Editor
editor = null
editorInitialized = false
SnippetEditorSetValue = (snippet) ->
  if editorInitialized
    editor.getSession().setValue snippet
  else
    $("#action-pane .input textarea")[0].value = snippet
SnippetEditorGetValue = ->
  if editorInitialized
    editor.getSession().getValue()
  else
    # $("#snippet-runner-code-content").text()
    # console.log($("#action-pane .input textarea"))
    $("#action-pane .input textarea")[0].value
# SnippetEditorInitialize = ->
#   if window.ace
#     editor = ace.edit("code-editor")
#     editor.setTheme "ace/theme/solarized_light"
#     editor.getSession().setMode "ace/mode/ruby"
#     editorInitialized = true



# Initialize Elements
$body = $("body")
$loadingIndicator = $("#code-loading-placebo")
snippetRequestError = $("#snippet-request-error-template").text()
$runner = $("#snippet-runner")
$("#snippet-request-error-template").remove()

# SnippetEditorInitialize()
ChallengeInitialize()

$(".btn-run").on 'click', ->
  $outputTarget = $("#run-output")
  snippet = SnippetEditorGetValue()
  $loadingIndicator.fadeIn("fast")

  params = snippet: snippet, challenge_path: challengePath
  console.log(params)
  params.capabilities = challengeCapabilities if challengeCapabilities? && challengeCapabilities.length > 0
  $.post(rubyEvalRoot + "/coba-ruby.json", params, (data, textStatus, xhr) ->
    if challengeAnswerable && data.is_correct
      ChallengeNavigateToPath data.next_challenge_path

    $loadingIndicator.fadeOut("fast")
    # console.log(data.output)
    $outputTarget.text data.output

    if data.popups?
      $popup = $("#popup")
      $popup.empty()
      for popup in data.popups
        if popup.type == "CRURLResource"
          $popup.append($('<iframe src="' + popup.url + '"></iframe>'))
        else
          $popup.append(popup.content)

  ).fail (response, status, message) ->
    $loadingIndicator.fadeOut("fast")
    errorMessage = response.responseText
    errorMessage = snippetRequestError if !errorMessage? || parseInt(response.status, 10) >= 500
    $outputTarget.text errorMessage

$('.tab-button').on 'click', ->
  $t = $ this
  selectedClass = 'tab-button-selected'
  unless $t.hasClass(selectedClass)
    $t.addClass(selectedClass)
  $t.siblings().removeClass(selectedClass)
  $tab = $t.parent().parent()
  $tab.find('.tab-item').hide()
  $tab.find($t.data('show-selector')).show()

$('.js-clear-popup').on 'click', -> $('#popup').empty()

$('.js-share-facebook').on 'click', ->
  console.log("hoho")
  sharer = "https://www.facebook.com/sharer/sharer.php?u=";
  window.open(sharer + $(this).data('url'), 'sharer', 'width=626,height=436');

$('.js-share-twitter').on 'click', ->
  $t = $ this
  sharer = "https://twitter.com/intent/tweet?"
  params =
    hashtags: $t.data('hashtags'),
    original_referer: window.location.href,
    text: "Coba Ruby, Yuk!",
    tw_p: "tweetbutton",
    url: $t.data('url')
  window.open(sharer + $.param(params), 'sharer', 'width=626,height=436');

$(".output .tabs").tabify()