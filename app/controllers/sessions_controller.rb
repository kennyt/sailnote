class SessionsController < ApplicationController
	def new
		if current_user.nil?
			@user = User.new
			render 'new'
		else
			redirect_to user_path(current_user)
		end
	end

	def create
		@user = User.find_by_username(params[:session][:username].downcase)
	  if @user && @user.authenticate(params[:session][:password])
	  	build_cookie(@user)
	  	redirect_to user_path(current_user)
	    # Sign the user in and redirect to the user's show page.
	  else
	    # Create an error message and re-render the signin form.
	    render 'new'
	  end
	end

	def destroy
		@user = current_user
    @user.update_attributes(remember_token: nil)
    cookies[:token] = ''

    redirect_to root_path
	end
end
