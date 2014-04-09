class Post < ActiveRecord::Base
  attr_accessible :title, :text, :published, :published_date
  validates :user_id, presence: true
  validates :title, uniqueness: { case_sensitive: false }, presence: true
  belongs_to :user

   def to_param
    title.split(' ').join('-')
  end

  def self.find(input)
  	input = input.gsub('-',' ')
    input.to_i == 0 ? find_by_title(input) : super
  end
end
