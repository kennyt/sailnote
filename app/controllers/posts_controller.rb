class PostsController < ApplicationController
	def new
		@post = current_user.posts.build
	end

	def create
		if params[:edit] && params[:edit].length > 0
			title = params[:post][:title].gsub('-',' ')
			if current_user.posts.find_by_id(params[:post][:id]).update_attributes(:text => params[:post][:text], :title => title)
				respond_to do |format|
					format.json { render :json => {'yes' => '1'}.to_json }
				end
			else
				respond_to do |format|
					format.json { render :json => {'no' => '1'}.to_json }
				end
			end
		else
			params[:post][:title] = params[:post][:title].gsub('-',' ')
			@post = current_user.posts.build(post_params)
			if @post.save
				respond_to do |format|
					format.json { render :json => {'yes' => '1', 'id' => @post.id.to_s}.to_json }
	      	format.html { redirect_to user_path(current_user) }
				end
	    else
	    	respond_to do |format|
					format.json { render :json => {'no' => '1'}.to_json }
	      	format.html { render 'new' }
				end
	    end
	  end
	end

	def show
		@user = User.find(params[:id])
		@post = @user.posts.find_by_title(params[:title].gsub('-',' '))
		@text = clean_text(@post.text)
	end

	def edit
		@post = current_user.posts.find_by_title(params[:id].gsub('-',' '))
	end

	def update
		@post = current_user.posts.find_by_title(params[:id].gsub('-',' '))

		if @post.update_attributes(post_params)
	    redirect_to post_path(@post)
	  else
	    render 'edit'
	  end
	end

	def publish
		@post = current_user.posts.find_by_title(params[:id].gsub('-', ' '))
		@post.update_attributes(:published => true, :published_date => Time.now)

		redirect_to user_path(current_user)
	end

	def destroy
		@post = current_user.posts.find_by_title(params[:id].gsub('-', ' '))
		@post.destroy

		redirect_to user_path(current_user)
	end
	private

		def post_params
	    params.require(:post).permit(:title, :text)
	  end
end
