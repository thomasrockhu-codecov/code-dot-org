And(/^I give user "([^"]*)" project validator permission$/) do |name|
  require_rails_env
  user = User.find_by_email_or_hashed_email(@users[name][:email])
  user.permission = UserPermission::PROJECT_VALIDATOR
  user.save!
end

Then(/^I remove featured projects from the gallery$/) do
  require_rails_env
  FeaturedProject.delete_all
end

Then(/^I make a playlab project named "([^"]*)"$/) do |name|
  steps %Q{
    Then I am on "http://studio.code.org/projects/playlab/new"
    And I get redirected to "/projects/playlab/([^\/]*?)/edit" via "dashboard"
    And I wait for the page to fully load
    And element "#runButton" is visible
    And element ".project_updated_at" eventually contains text "Saved"
    And I click selector ".project_edit"
    And I type "#{name}" into "input.project_name"
    And I click selector ".project_save"
    And I wait until element ".project_edit" is visible
    Then I should see title "#{name} - Play Lab"
    And I press "#runButton" using jQuery
    And I wait until element ".project_updated_at" contains text "Saved"
    And I wait until initial thumbnail capture is complete
  }
end

Then(/^I publish the project$/) do
  steps %Q{
    Given I open the project share dialog
    And the project is unpublished
    When I publish the project from the share dialog
  }
end

Then /^I open the project share dialog$/ do
  steps <<-STEPS
    Then I click selector ".project_share"
    And I wait to see a dialog titled "Share your project"
  STEPS
end

Then /^I publish the project from the share dialog$/ do
  steps <<-STEPS
    And I click selector "#share-dialog-publish-button"
    Then I publish the project from the publish to gallery dialog
  STEPS
end

Then /^I publish the project from the personal projects table publish button$/ do
  steps <<-STEPS
    And I wait until element ".ui-personal-projects-publish-button" is visible
    Then I click selector ".ui-personal-projects-publish-button"
    Then I publish the project from the publish to gallery dialog
    And I wait until element ".ui-personal-projects-unpublish-button" is visible
  STEPS
end

Then /^I publish the project from the publish to gallery dialog$/ do
  steps <<-STEPS
    And I wait to see a publish dialog with title containing "Publish to Public Gallery"
    And element "#publish-dialog-publish-button" is visible
    And I click selector "#publish-dialog-publish-button"
    And I wait for the dialog to close
  STEPS
end

Then /^I navigate to the public gallery via the gallery switcher$/ do
  steps <<-STEPS
    Then I click selector "#uitest-gallery-switcher div:contains(Public Projects)"
    Then check that I am on "http://studio.code.org/projects/public"
    And I wait until element "#public-gallery" is visible
    And element "#react-personal-projects" is not visible
  STEPS
end

Then /^I navigate to the personal gallery via the gallery switcher$/ do
  steps <<-STEPS
    Then I click selector "#uitest-gallery-switcher div:contains(My Projects)"
    Then check that I am on "http://studio.code.org/projects"
    And I wait until element "#public-gallery" is not visible
    And element "#react-personal-projects" is visible
  STEPS
end

Then /^I wait to see a publish dialog with title containing "((?:[^"\\]|\\.)*)"$/ do |expected_text|
  steps %{
    Then I wait to see ".publish-dialog-title"
    And element ".publish-dialog-title" contains text "#{expected_text}"
  }
end

Then /^I unpublish the project from the share dialog$/ do
  steps <<-STEPS
    Then I click selector "#share-dialog-unpublish-button"
    And I wait for the dialog to close
  STEPS
end

Then /^the project is (un)?published/ do |negation|
  published = negation.nil?
  expect(element_visible?("#share-dialog-publish-button")).to eq(!published)
  expect(element_visible?("#share-dialog-unpublish-button")).to eq(published)
end

Then /^the project cannot be published$/ do
  expect(element_visible?("#share-dialog-publish-button")).to eq(false)
  expect(element_visible?("#share-dialog-unpublish-button")).to eq(false)
end

Then /^the project can be published$/ do
  expect(element_visible?("#share-dialog-publish-button")).to eq(true)
end

Then /^I reload the project page/ do
  steps <<-STEPS
    And I reload the page
    And I wait for the page to fully load
    And element ".project_updated_at" eventually contains text "Saved"
  STEPS
end

Then /^I set the project version interval to (\d+) seconds?$/ do |seconds|
  code = "window.dashboard.project.__TestInterface.setSourceVersionInterval(#{seconds});"
  @browser.execute_script(code)
end

Then /^the project table contains ([\d]+) (?:row|rows)$/ do |expected_num|
  actual_num = @browser.execute_script("return $('.ui-personal-projects-row').length;")
  expect(actual_num).to eq(expected_num.to_i)
end

Then /^the first project in the table is named "([^"]*)"$/ do |expected_name|
  steps %{
    And I wait until element ".ui-projects-table-project-name" is visible
    And I wait until the first ".ui-projects-table-project-name" contains text "#{expected_name}"
  }
end

Then /^the project gallery contains ([\d]+) project (?:type|types)$/ do |expected_num|
  actual_num = @browser.execute_script("return $('.ui-project-app-type-area').length;")
  expect(actual_num).to eq(expected_num.to_i)
end

Then /^the project gallery contains ([\d]+) view more (?:link|links)$/ do |expected_num|
  actual_num = @browser.execute_script("return $('.viewMoreLink').length;")
  expect(actual_num).to eq(expected_num.to_i)
end
