# == Schema Information
#
# Table name: course_offerings
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  properties :text(65535)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_course_offerings_on_name  (name) UNIQUE
#

FactoryGirl.define do
  factory :course_offering do
    name "MyString"
    properties "MyText"
  end
end
