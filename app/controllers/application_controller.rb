class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user, :user_path, :about_path, :clean_text

  def build_cookie(user)
    cookies.permanent[:token] = SecureRandom.uuid
    user.update_attribute(:remember_token, cookies[:token])
  end

  def current_user
    return nil if cookies[:token] == ''
    User.find_by_remember_token(cookies[:token]) if cookies[:token]
  end

  def user_path(user)
    '/'+user.username
  end

  def post_path(post)
    '/'+current_user.username+'/'+post.title.gsub(' ','-')
  end

  def about_path(user)
    '/about/'+user.username
  end

  def clean_text(text)
    text = text.split('')
    text.each_with_index do |char, i|
      if char == "<"
        text[i] = "kzxpqzcmskrlawtkbcksd"
      end
    end
    text = text.join('')

    text.split(/\r?\n/).map do |paragraph|
      startAndEnd = {}
      bracketsStartAndEnd = [nil,nil]
      previousIsAst = false
      paragraph = paragraph.split('')
      paragraph.each_with_index do |char, i|
        if char == ' ' && previousIsAst
          if startAndEnd['italics']
            startAndEnd['italics'] = nil
          elsif startAndEnd['bold'] && (i - startAndEnd['bold'][1] == 1)
            startAndEnd['bold'] = nil
          end
        end

        if char == '*'
          if previousIsAst
            if startAndEnd['bold'].nil?
              startAndEnd['bold'] = [previousIsAst, i]
              previousIsAst = i
              startAndEnd['italics'] = nil
            else
              paragraph[startAndEnd['bold'][0]] = ''
              paragraph[startAndEnd['bold'][1]] = '<b>'
              paragraph[previousIsAst] = ''
              paragraph[i] = '</b>'
              startAndEnd = {}
            end
          else
            previousIsAst = i
            if startAndEnd['italics'].nil?
              startAndEnd['italics'] = previousIsAst
            else
              paragraph[startAndEnd['italics']] = '<i>'
              paragraph[i] = '</i>'
              startAndEnd = {}
            end
          end
        else
          previousIsAst = false
        end

        if char == "["
          bracketsStartAndEnd[0] = i
          bracketsStartAndEnd[1] = nil
        end
        if char == "]"
          bracketsStartAndEnd[1] = i if bracketsStartAndEnd[0]
        end
        if char == "(" && bracketsStartAndEnd[1]
          if (i - bracketsStartAndEnd[1] == 1)
            paragraph[i..-1].each_with_index do |char2, z|
              if char2 == ")"
                link_name = paragraph[bracketsStartAndEnd[0]+1..bracketsStartAndEnd[1]-1].join('')
                link = paragraph[i+1..i+z-1].join('')
                paragraph.each_with_index do |char3, p|
                  paragraph[p] = '' if p > bracketsStartAndEnd[0]-1 && i+z > p
                end
                paragraph[i+z] = '<a class="text_link" dataz="'+bracketsStartAndEnd[0].to_s+'" href="'+link+'">'+link_name+'</a>'
                break
              end
            end
          else
            bracketsStartAndEnd = [nil, nil]
          end
        end

        # if char == "<"
        #   paragraph[i] = "&:kltzoe;"
        # end
      end
      paragraph = paragraph.join('')
    end.join("\r\n")
  end
end
