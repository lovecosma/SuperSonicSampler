class AddUrlToSamplees < ActiveRecord::Migration[6.0]
  def change
    add_column :samples, :url, :string
  end
end
