class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
    	t.integer :user_id
    	t.text :text
    	t.string :title
    	t.integer :hits, :default => 1
      t.boolean :published, :default => false

      t.timestamps
    end
    add_index :posts, [:user_id, :created_at]
  end
end
