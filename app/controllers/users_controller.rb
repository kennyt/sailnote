class UsersController < ApplicationController
	def new
		@user = User.new
	end

	def create
		@user = User.new(user_params)
    if @user.save
    	image_array = ['http://i.imgur.com/iEeeRSq.jpg', 'http://i.imgur.com/PLUS3y1.jpg', 'http://i.imgur.com/S9pfRrW.jpg', 'http://i.imgur.com/Nd0eRNj.jpg']
    	@user.update_attribute(:image_banner, image_array.sample)
    	build_cookie(@user)
    	redirect_to user_path(@user)
    else
      render 'new'
    end
	end

	def show
		@user = User.find(params[:id])
		@published_posts = @user.posts.where(:published => true).order('published_date DESC')
		@authored_bool = current_user && current_user == @user
		if @authored_bool
			@unpublished_posts = @user.posts.where(:published => false).order('updated_at DESC')
			@email_follower_number = @user.email_followers.split(',').length
		end
	end

	def about
		@user = User.find(params[:id])
		@user.about.nil? ? @about = "" : @about = clean_text(@user.about)
		if current_user && current_user == @user
			@email_follower_number = @user.email_followers.split(',').length
		end
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
			respond_to do |format|
				format.json { render :json => {'yes' => '1'}.to_json }
				format.html { redirect_to about_path(@user) }
			end
	  else
	  	respond_to do |format|
				format.json { render :json => {'no' => '1'}.to_json }
    		format.html { render 'edit_about' }
			end
	  end
	end

	def update_pic
		if current_user && current_user.update_attribute(:image_banner, params[:link])
			respond_to do |format|
				format.json { render :json => {'yes' => '1'}.to_json }
			end
		else
			respond_to do |format|
				format.json { render :json => {'no' => '1'}.to_json }
			end
		end
	end

	def add_email_follower
		email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
		@user = User.find(params[:id])
		if params[:email] && email_regex.match(params[:email])
			if @user.email_followers.split(',').length > 0
				updated_followers = @user.email_followers+','+params[:email]
			else
				updated_followers = params[:email]
			end
			@user.update_attribute(:email_followers, updated_followers)
			respond_to do |format|
				format.json { render :json => {'yes' => '1'}.to_json }
			end
		else
			respond_to do |format|
				format.json { render :json => {'no' => '1'}.to_json }
			end
		end
	end

	private
    def user_params
      params.require(:user).permit(:username, :email, :password,
                                   :password_confirmation, :about)
    end
end
