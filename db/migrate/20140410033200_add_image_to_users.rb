class AddImageToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :image_banner, :string
  	add_column :users, :image_top_margin, :integer, :default => 0
  end
end
