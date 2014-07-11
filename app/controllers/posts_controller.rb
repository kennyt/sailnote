class PostsController < ApplicationController
	def new
		@post = current_user.posts.build
	end

	def create
		params[:post][:title] = params[:post][:title].gsub('-',' ')
		@post = current_user.posts.build(post_params)
		@post.url = uniquify_url(CGI.escape(@post.title.gsub(' ','-').downcase))
		@post.text = "<section class='text_center_panel color_white graceful_font'><p><br></p> <p><br></p></section>"
		if @post.save
			respond_to do |format|
				format.json { render :json => {'yes' => '1', 'id' => @post.id.to_s, 'date' => @post.updated_at.strftime("%0d %b %y"), 'url' => @post.url}.to_json }
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
		@post = @user.posts.first(:conditions => ["url = ?", CGI.escape(params[:title])])
		if ( !@post.nil? && @post.published) || ( !@post.nil? && current_user && @user == current_user)
			# @text = clean_text(@post.text)
			@text = @post.text || "<p><br></p><p><br></p>"
		else
			redirect_to user_path(@user)
		end
	end

	def edit
		@post = current_user.posts.first(:conditions => ["lower(title) = ?", CGI.unescape(params[:id].gsub('-',' ').downcase)])
		@archive_posts = @post.user.posts.where(:published => true).order('published_date DESC')
		@text = @post.text || ""
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
		@post = current_user.posts.first(:conditions => ["url = ?", CGI.escape(params[:id])])
		if @post.update_attributes(:published => true, :published_date => Time.now)
			# email_followers = current_user.email_followers.split(',')
			# UserMailer.notify_post(email_followers, current_user, @post).deliver

			respond_to do |format|
				format.json { render :json => {'yes' => '1', 'pub_date' => @post.published_date.strftime("%0d %b %y"), 'views' => @post.hits}.to_json }
				format.html { redirect_to user_path(current_user) }
			end
		else
			respond_to do |format|
				format.json { render :json => {'no' => '1'}.to_json }
				format.html { redirect_to user_path(current_user) }
			end
		end
	end

	def unpublish
		@post = current_user.posts.first(:conditions => ["url = ?", CGI.escape(params[:id])])
		if @post.update_attribute(:published, false)

			respond_to do |format|
				format.json { render :json => {'yes' => '1'}.to_json }
				format.html { redirect_to user_path(current_user) }
			end
		else
			respond_to do |format|
				format.json { render :json => {'no' => '1'}.to_json }
				format.html { redirect_to user_path(current_user) }
			end
		end
	end

	def destroy
		@post = current_user.posts.first(:conditions => ["url = ?", CGI.escape(params[:id])])
		@post.destroy

		redirect_to user_path(current_user)
	end

	def update_post_json
		title = CGI.unescape(params[:post][:title].gsub('-',' '))
		url = CGI.escape(params[:post][:url].gsub(' ','-').downcase)
		@post = current_user.posts.find_by_id(params[:post][:id])
		if @post.update_attributes(:text => params[:post][:text], :title => title, :url => url)
			respond_to do |format|
				format.json { render :json => {'yes' => '1', 'url' => url}.to_json }
			end
		else
			respond_to do |format|
				format.json { render :json => {'no' => @post.errors.full_messages}.to_json }
			end
		end
	end

	def delete_post_json
		@post = current_user.posts.first(:conditions => ["url = ?", CGI.escape(params[:title])])
		if @post.destroy
			respond_to do |format|
				format.json { render :json => {'yes' => '1'}.to_json }
			end
		else
			respond_to do |format|
				format.json { render :json => {'no' => '1'}.to_json }
			end
		end
	end

	def increment_viewcount
		@user = User.find(params[:id])
		@post = @user.posts.first(:conditions => ["url = ?", CGI.escape(params[:title])])
		@post.update_attribute(:hits, @post.hits + 1)

		respond_to do |format|
			format.json { render :json => {'yes' => '1'}.to_json }
		end
	end

	# def upload_image
	# 	if params[:image_id].present?
	# 	  preloaded = Cloudinary::PreloadedFile.new(params[:image_id])         
	# 	  raise "Invalid upload signature" if !preloaded.valid?
	# 	  puts '##################' + preloaded.identifier + '##############################'
	# 	end
	# 	puts 'fuckkkkkkkkkkkkkkk###############################'
	# end


	private

		def post_params
	    params.require(:post).permit(:title, :text)
	  end
end
