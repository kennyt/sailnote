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
    end
  end
  match '/about/:id' => 'users#about'
  match '/about/:id/edit' => 'users#edit_about'
  match '/:id' => 'users#show'
  match '/:id/:title' => 'posts#show'
  # match '/signup',  to: 'users#new',            via: 'get'
  # match '/signin',  to: 'sessions#new',         via: 'get'
  # match '/signout', to: 'sessions#destroy',     via: 'delete'
  root to: 'sessions#new'
end
