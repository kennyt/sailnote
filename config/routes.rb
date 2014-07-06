Essaii::Application.routes.draw do
  resources :users do
    member do
      put 'update_about'
    end
  end

  resources :sessions, only: [:new, :create, :destroy]
  resources :posts do 
    member do
        post 'publish'
        post 'unpublish'
    end
  end
  match '/:username/change_bio' => 'users#change_bio'
  match '/about/:id' => 'users#about'
  match '/about/:id/edit' => 'users#edit_about'
  match '/about/:id/update_about' => 'users#update_about', via: 'post'
  match '/:id' => 'users#show'
  match '/:id/update_pic' => 'users#update_pic'
  match '/:id/add_email_follower' => 'users#add_email_follower'
  match '/:id/:title' => 'posts#show'
  match '/:id/:title/update_post' => 'posts#update'
  match '/:id/:title/update_post_json' => 'posts#update_post_json'
  match '/:id/:title/increment_viewcount' => 'posts#increment_viewcount'
  match '/posts/:title/delete_post_json' => 'posts#delete_post_json'
  match ':id/:title/upload_image' => 'posts#update_image'
  # match '/signup',  to: 'users#new',            via: 'get'
  # match '/signin',  to: 'sessions#new',         via: 'get'
  # match '/signout', to: 'sessions#destroy',     via: 'delete'
  root to: 'sessions#new'
end
