class Post < ActiveRecord::Base
  attr_accessible :title, :text, :published, :published_date
  validates :user_id, presence: true
  validates :title, uniqueness: { case_sensitive: false, scope: :user_id }, presence: true
  validate :no_periods
  validate :no_hyphen
  belongs_to :user

   def to_param
    title.split(' ').join('-') if title
  end

  def self.find(input)
  	input = input.gsub('-',' ')
    input.to_i == 0 ? find_by_title(input) : super
  end

  def no_periods
    if title.include?('.')
      errors.add(:title, "can't include a period.")
    end
  end

  def no_hyphen
    if title.include?('-')
      errors.add(:title, "can't include a hypen.")
    end
  end
end
