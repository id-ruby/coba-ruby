###
# Blog settings
###

# Time.zone = "UTC"

host = "id-ruby.org"
set :share_url, "http://#{host}/coba-ruby/"
set :default_meta_description, "Punya 15 menit? Mari mencoba bahasa pemrograman Ruby sekarang! Kelebihan Ruby terletak pada kesederhanaannya dibalik kemampuannya."

if ENV["DEPLOY"]
  set :cookie_prefix, "prod_"
  set :asset_root, "http://#{host}/coba-ruby"
  set :challenge_root, "http://#{host}/coba-ruby/tingkat"
  set :ruby_eval_root, "http://mengenal-ruby-eval.herokuapp.com"
else
  set :cookie_prefix, "dev_"
  set :asset_root, "http://localhost:4567"
  set :challenge_root, "http://localhost:4567/tingkat"
  set :ruby_eval_root, "http://localhost:4000"
end

activate :deploy do |deploy|
  deploy.method = :git
  deploy.remote = "git@github.com:id-ruby/coba-ruby.git"
  deploy.branch = "gh-pages"
end

###
# Compass
###

# Susy grids in Compass
# First: gem install susy
# require 'susy'

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

activate :gzip
activate :minify_html

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :cache_buster

  # Use relative URLs
  # activate :relative_assets
  activate :image_optim

  # Or use a different image path
  # set :http_path, "/Content/images/"
end

activate :syntax
set :markdown, :tables => true, :autolink => true, :gh_blockcode => true, :fenced_code_blocks => true
set :markdown_engine, :redcarpet
