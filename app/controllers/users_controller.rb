class UsersController < ApplicationController
	def new
		@user = User.new
	end

	def create
		if params[:edit_about]
			if current_user.update_attribute(:about, params[:about])
				respond_to do |format|
					format.json { render :json => {'yes' => '1'}.to_json }
				end
			else
				respond_to do |format|
					format.json { render :json => {'no' => '1'}.to_json }
				end
			end
		else
			@user = User.new(user_params)
	    if @user.save
	    	build_cookie(@user)
	    	redirect_to @user
	    else
	      render 'new'
	    end
	  end
	end

	def show
		@user = User.find(params[:id])
		@published_posts = @user.posts.where(:published => true).order('published_date DESC')
		@unpublished_posts = @user.posts.where(:published => false).order('updated_at DESC') if current_user == @user
	end

	def about
		@user = User.find(params[:id])
		@user.about.nil? ? @about = "" : @about = clean_text(@user.about)
	end

	def edit_about
		@user = User.find(params[:id])
		unless current_user && @user == current_user
			redirect_to user_path(@user)
		end
	end

	def update_about
		@user = User.find(params[:id])
		if current_user && @user == current_user && @user.update_attribute(:about, params[:user][:about])
	    redirect_to about_path(@user)
	  else
	    render 'edit_about'
	  end
	end

	private
    def user_params
      params.require(:user).permit(:username, :email, :password,
                                   :password_confirmation, :about)
    end
end
