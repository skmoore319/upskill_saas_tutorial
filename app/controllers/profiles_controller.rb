class ProfilesController < ApplicationController
  
  # GET request for '/users/:user_id/profile/new'
  def new
    # Render a blank profile details form
    @profile = Profile.new
  end
  
  # POST request for '/users/:user_id/profile'
  def create
    # Ensure that we have the user who is filling out the form
    @user = User.find( params[:user_id] )
    # Create profile linked to this specific user
    @profile = @user.build_profile( profile_params )
    if @profile.save
      flash[:success] = "Profile updated!"
      redirect_to user_path(id: params[:user_id] )
    else
      render action: :new
    end
  end
  
  # GET request for '/users/:user_id/profile/edit'
  def edit
    @user = User.find( params[:user_id] )
    @profile = @user.profile
  end
  
  # PUT request to '/users/:user_id/profile'
  def update
    # Retrieve the user from the database
    @user = User.find( params[:user_id] )
    # Retrieve the user's profile
    @profile = @user.profile
    # Edit profile attributes and save.
    if @profile.update_attributes(profile_params)
      flash[:success] = "Profile updated!"
      # Redirect user to their profile page
      redirect_to user_path(id: params[:user_id])
    else
      render action: :edit
    end
  end
  
  private
    def profile_params
      params.require(:profile).permit(:first_name, :last_name, :avatar, :job_title, :phone_number, :contact_email, :description)
    end
end