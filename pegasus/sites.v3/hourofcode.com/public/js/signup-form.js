var google;
var thanksUrl;
var signupErrorMessage;
var censusErrorMessage;
var hocYear;

$(document).ready(function () {
  new google.maps.places.SearchBox(document.getElementById('hoc-event-location'));

  $('#hoc-signup-form select').selectize({
    plugins: ['fast_click']
  });

  $("#hoc-signup-form").submit(function ( event ) {
    if (validateFields()) {
      signupFormSubmit(gotoThankYouPage);
    }
  });

  $("#census-form").submit(function ( event ) {
    censusFormSubmit();
  });

  $('#continue').click(function () {
    if (validateFields()) {
      signupFormSubmit(showCensusForm);
    }
  });

  $('#hoc-special-event-flag').change(function () {
    if ($(this).is(':checked')) {
      $('#hoc-special-event-details').closest('.form-group').slideDown();
    } else {
      $('#hoc-special-event-details').closest('.form-group').slideUp();
    }
  });

  function checkShowNameEventLocation() {
    // in-school & US
    if (($('#hoc-event-type').val() === 'in_school') && ($("#country").val() === 'US')) {
      $('#school-name-field').show();
      $('#organization-name-field').hide();
      $('#hoc-event-location-field').show();
      $('#hoc-entire-school').show();
      // continue button goes to census questions on click
      $('.continue-btn').show();
      $('#submit-button').hide();
    } else if (($('#hoc-event-type').val() === 'in_school')){
    // in-school & NOT US
      $('#school-name-field').show();
      $('#organization-name-field').hide();
      $('#hoc-event-location-field').show();
      $('#hoc-entire-school').show();
      $('.continue-btn').hide();
      $('#submit-button').show();
    } else if ($('#hoc-event-type').val() === 'out_of_school') {
      // out of school, either US or non-US
      $('#organization-name-field').show();
      $('#hoc-event-location-field').show();
      $('#school-name-field').hide();
      $('#hoc-entire-school').hide();
      $('.continue-btn').hide();
      $('#submit-button').show();
    }
  }

  $('#country').change(function () {
    checkShowNameEventLocation();
  });

  $('#hoc-event-type').change(function () {
    checkShowNameEventLocation();
  });

  function checkShowCensusFollowUp() {
    if ($("#twenty-hour-how-much").val() === "some" || $("#twenty-hour-how-much").val() === "all" || $("#ten-hour-how-much").val() === "some" ||
    $("#ten-hour-how-much").val() === "all") {
      $('#followup_questions').show();
    } else {
      $('#followup_questions').hide();
    }
  }

  $('#twenty-hour-how-much').change(function () {
    checkShowCensusFollowUp();
  });

  $('#ten-hour-how-much').change(function () {
    checkShowCensusFollowUp();
  });

  $('#role').change(function () {
    if ($(this).val() === "teacher" || $(this).val() === "administrator") {
      $('#pledge').show();
    } else {
      $('#pledge').hide();
    }
  });
 });

function showCensusForm(data) {
  $('.main-form').hide();
  $('#signup-header').hide();
  $('.continue-btn').hide();
  // Copy all of the hoc-signup inputs to the census form
  $('.main-form :input').each(
    function (index) {
      var input = $(this);
      var name = input.attr('name');
      if (name !== undefined) {
        var newInput = document.createElement("input");
        newInput.value = input.val();
        newInput.setAttribute("name", input.attr('name'));
        newInput.setAttribute("type", "hidden");
        $('#census-form').append(newInput);
      }
    }
  );
  $('#census-header').show();
  $('#census-form').show();
}

function gotoThankYouPage() {
  window.location = thanksUrl;
}

function validateFields() {
  if ($("#hoc-name").val() === "") {
    $('#name-error').show();
    return false;
  } else {
    $('#name-error').hide();
  }

  if ($("#hoc-email").val() === "") {
    $('#email-error').show();
    return false;
  } else {
    $('#email-error').hide();
  }

  if ($("#country").val() === "") {
    $('#country-error').show();
    return false;
  } else {
    $('#country-error').hide();
  }

  if ($("#hoc-event-type").val() === "") {
    $('#event-type-error').show();
    return false;
  } else {
    $('#event-type-error').hide();
  }

  if  ($("#hoc-event-type").val() === "in_school") {
    if ($("#school-name").val() === "") {
      $('#school-name-error').show();
      return false;
    } else {
      $('#school-name-error').hide();
    }
  }

  if  ($("#hoc-event-type").val() === "out_of_school") {
    if ($("#organization-name").val() === "") {
      $('#organization-name-error').show();
      return false;
    } else {
      $('#organization-name-error').hide();
    }
  }

  if ($("#hoc-event-location").val() === "") {
    $('#event-location-error').show();
    return false;
  } else {
    $('#event-location-error').hide();
  }
  return true;
}

function signupFormError(data) {
  $('#error_message').html("<p>" + signupErrorMessage + "</p>").show();
  $("#signup_submit").removeAttr('disabled');
}

function censusFormError(data) {
  $('#error_message').html("<p>" + censusErrorMessage + "</p>").show();
  $("#census_submit").removeAttr('disabled');
}

function signupFormSubmit(successHandler) {
  $("#signup_submit").attr('disabled','disabled');

  $.ajax({
    url: "/forms/HocSignup" + hocYear,
    type: "post",
    dataType: "json",
    data: $("#hoc-signup-form").serialize()
  }).done(successHandler).fail(signupFormError);
}

function censusFormSubmit() {
  $("#census_submit").attr('disabled','disabled');

  $.ajax({
    url: "/forms/HocCensus" + hocYear,
    type: "post",
    dataType: "json",
    data: $("#census-form").serialize()
  }).done(gotoThankYouPage).fail(censusFormError);
}
