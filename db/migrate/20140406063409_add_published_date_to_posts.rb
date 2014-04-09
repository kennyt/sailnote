class AddPublishedDateToPosts < ActiveRecord::Migration
  def change
  	add_column :posts, :published_date, :timestamp
  end
end
