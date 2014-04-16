class UserMailer < ActionMailer::Base
  default from: "essaii.notifications@gmail.com"

  def notify_post(emails, user, post)
  	@title = post.title
  	@user = user
  	@url = "http://www.essaii.com/"+user.username+"/"+CGI.escape(@title.gsub(' ','-').downcase)
  	mail(to: 'essaii.notifications@gmail.com', bcc: emails, subject: 'essaii - New Post by '+user.username)
  end
end
