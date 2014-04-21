class PostsController < ApplicationController
	def new
		@post = current_user.posts.build
	end

	def create
		params[:post][:title] = params[:post][:title].gsub('-',' ')
		@post = current_user.posts.build(post_params)
		if @post.save
			respond_to do |format|
				format.json { render :json => {'yes' => '1', 'id' => @post.id.to_s, 'date' => @post.updated_at.strftime("%0d %b %y")}.to_json }
      	format.html { redirect_to user_path(current_user) }
			end
    else
    	respond_to do |format|
				format.json { render :json => {'no' => @post.errors.full_messages}.to_json }
      	format.html { render 'new' }
			end
    end
	end

	def show
		@user = User.find(params[:id])
		@post = @user.posts.first(:conditions => ["lower(title) = ?", CGI.unescape(params[:title].gsub('-',' ').downcase)])
		@archive_posts = @user.posts.where(:published => true).order('published_date DESC')
		if @post.published || (current_user && @user == current_user)
			# @text = clean_text(@post.text)
			@text = @post.text || ""
		else
			redirect_to user_path(@user)
		end
	end

	def edit
		@post = current_user.posts.first(:conditions => ["lower(title) = ?", CGI.unescape(params[:id].gsub('-',' ').downcase)])
	end

	def update
		@post = current_user.posts.first(:conditions => ["lower(title) = ?", CGI.unescape(params[:id].gsub('-',' ').downcase)])

		if @post.update_attributes(post_params)
	    redirect_to post_path(@post)
	  else
	    render 'edit'
	  end
	end

	def publish
		@post = current_user.posts.first(:conditions => ["lower(title) = ?", CGI.unescape(params[:id].gsub('-',' ').downcase)])
		if @post.update_attributes(:published => true, :published_date => Time.now)
			email_followers = current_user.email_followers.split(',')
			UserMailer.notify_post(email_followers, current_user, @post).deliver
		end

		redirect_to user_path(current_user)
	end

	def destroy
		@post = current_user.posts.first(:conditions => ["lower(title) = ?", CGI.unescape(params[:id].gsub('-',' ').downcase)])
		@post.destroy

		redirect_to user_path(current_user)
	end

	def update_post_json
		title = CGI.unescape(params[:post][:title].gsub('-',' '))
		@post = current_user.posts.find_by_id(params[:post][:id])
		if @post.update_attributes(:text => params[:post][:text], :title => title)
			respond_to do |format|
				format.json { render :json => {'yes' => '1'}.to_json }
			end
		else
			respond_to do |format|
				format.json { render :json => {'no' => @post.errors.full_messages}.to_json }
			end
		end
	end

	def increment_viewcount
		@user = User.find(params[:id])
		@post = @user.posts.first(:conditions => ["lower(title) = ?", CGI.unescape(params[:title].gsub('-',' ').downcase)])
		@post.update_attribute(:hits, @post.hits + 1)

		respond_to do |format|
			format.json { render :json => {'yes' => '1'}.to_json }
		end
	end
	private

		def post_params
	    params.require(:post).permit(:title, :text)
	  end
end
