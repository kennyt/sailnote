class User < ActiveRecord::Base
	has_secure_password
  attr_accessible :username, :email, :password, :password_confirmation, :remember_token, :about, :image_banner, :image_margin_top, :email_followers
  validates :username, presence: true, length: { maximum: 20, minimum: 2 }, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 4 }
  has_many :posts, dependent: :destroy
  # before_create :create_remember_token
  # VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  # validates :email, presence:   true,
  #                   format:     { with: VALID_EMAIL_REGEX },
  #                   uniqueness: { case_sensitive: false }

  def self.find(input)
    input.to_i == 0 ? find_by_username(input) : super
  end
end
