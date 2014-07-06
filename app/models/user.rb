class User < ActiveRecord::Base
	has_secure_password
  attr_accessible :username, :email, :password, :password_confirmation, :remember_token, :about, :image_banner, :image_margin_top, :email_followers, :bio
  validates :username, presence: true, length: { maximum: 20, minimum: 2 }, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 4 }
  validate :url_safe
  has_many :posts, dependent: :destroy
  # before_create :create_remember_token
  # VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  # validates :email, presence:   true,
  #                   format:     { with: VALID_EMAIL_REGEX },
  #                   uniqueness: { case_sensitive: false }

  def self.find(input)
    input.to_i == 0 ? find_by_username(input) : super
  end

  def url_safe
    errors.add(:username, 'must only be letters and numbers.') unless CGI.escape(username) == CGI.unescape(username)
    errors.add(:username, 'must not contain periods.') if username.include?('.')
  end
end
