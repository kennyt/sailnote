class UsersController < ApplicationController
	def new
		@user = User.new
	end

	def create
		@user = User.new(user_params)
    if @user.save
			@user.posts.create!(:title => 'Your First Post', :text => '<section class="text_center_panel classic_font color_white"><blockquote>Highlight any text to style it. Use the left to add image, edit the section (font, color theme, layout), and add section.</blockquote><h1>Boom!</h1><div><b>The following is filler text</b><br>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</div><blockquote class="pullquote">Welcome to Sailnote. Writing is hard. We\'ll try to help you.</blockquote><div>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></section>', :url => 'first')
    	# image_array = ['http://i.imgur.com/iEeeRSq.jpg', 'http://i.imgur.com/S9pfRrW.jpg']
    	# @user.update_attribute(:image_banner, image_array.sample)
    	build_cookie(@user)
    	redirect_to user_path(@user)
    else
      render 'sessions/new'
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
		@user.about.nil? ? @about = "" : @about = @user.about
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

	def change_bio
		if current_user.update_attribute(:bio, params[:user][:bio].squeeze(" "))
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
