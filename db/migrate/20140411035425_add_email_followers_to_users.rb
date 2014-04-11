class AddEmailFollowersToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :email_followers, :text, :default => ""
  end
end
