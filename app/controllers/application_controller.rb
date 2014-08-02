class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user, :user_path, :about_path, :clean_text, :uniquify_url, :post_path, :clean_url

  def build_cookie(user)
    cookies.permanent[:token] = SecureRandom.uuid
    user.update_attribute(:remember_token, cookies[:token])
  end

  def current_user
    return nil if cookies[:token] == ''
    User.find_by_remember_token(cookies[:token]) if cookies[:token]
  end

  def user_path(user)
    '/'+user.username
  end

  def post_path(post)
    '/'+current_user.username+'/'+post.url
  end

  def about_path(user)
    '/about/'+user.username
  end

  def uniquify_url(url)
    num = 1
    until current_user.posts.first(:conditions => ["url = ?", url]).nil?
      url = url + num.to_s
      num += 1
    end
    return url
  end

  def clean_url(url)
    url = CGI.unescape(url)
    url = url.gsub('.','').gsub('?','').gsub('!','')
  end
end
