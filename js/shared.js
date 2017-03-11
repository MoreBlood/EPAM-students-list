$(document).ready(function () {
    $('body').append('<div class="se-pre-con"></div>' +
        '<div class="modal_back not-visible-modal"></div>');

    $('.modal_back.not-visible-modal').load('modal.html', function() {
        $('.close-background, #close-bg').click(function () {
            CloseModal();
        })
    });

    $('#stud-body').on("mouseenter", ".left-td.first",  function () {
        $(this).find(".small-button").css({
            opacity : 0.4
        })
    });
    $('#stud-body').on("mouseleave", ".left-td.first",  function () {
        $(this).find(".small-button").css({
            opacity : 0
        })
    });
    $('#add-btn').click(function () {
        show_edit_center("add");
    });

    var navHeight = $('.navigation').height();

    $('.table-holder').css({
        marginTop :navHeight
    });
    $('.table-gr').stickyTableHeaders({fixedOffset: navHeight});
});

$(window).load(function () {
    $(".se-pre-con").fadeOut("slow");
});

var host = "http://localhost:8088";

function CloseModal() {
    $(".modal_back").removeClass("visible-modal");
    $(".app").css({
        filter: "blur(0px)"
    })
}
function EditSt(id) {
    var name = $('#new-st-name').val(), mark = $('#new-st-mark').val(), group = $('#new-st-group option:selected').attr('gr-id');
    EditStudent(id, name, mark, group);
    CloseModal();
}

function DeleteSt(id) {
    DeleteStudent(id);
    CloseModal();
}
function filterStud() {
    RenderStudents("?minGpa=" + $("#mark-range-left").val() + "&maxGpa=" + $("#mark-range-right").val());
    CloseModal();

}
function DeleteGr(id) {
    DeleteGroup(id);
    CloseModal();
}
function EditGr(id) {
    var name = $('#new-group-name').val(), grad = $('#new-group-grad').val();
    EditGroup(id, name, grad);
    CloseModal();
}
function AddGr() {
    var name = $('#new-group-name').val(), grad = $('#new-group-grad').val();
    AddGroup(name, grad);
    CloseModal();
}
function UpdateGr() {
    RenderGroups("?minGradDate=" + $("#date-start").val() + "&maxGradDate=" + $("#date-end").val());
    CloseModal();
}
function DrawGroupInfo(data) {

    $("#current-group").html(data.name);
    $(".big-year.end").html((data.graduationDate).substr(0, 4));
    $(".big-year.start").html((data.graduationDate).substr(0, 4) - 4);
    document.title = data.name + " Group";
}
function GetGroups() {
    var resp = $.ajax({
        type: "GET",
        url: host + "/groups",
        dataType: "json",
        async: false,
        success: function (data) {
            //alert(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
    return resp.responseText;


}
function DeleteStudent(param) {
    if (param == undefined) param = "";
    $.ajax({
        type: "DELETE",
        url: host + "/students/id" + param,
        success: function (data) {
            RenderStudents(getUrlParameter("group"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
}
function EditStudent(studentId, name, gpa, groupId) {
    var new_group = {"studentId": studentId, "name": name, "gpa": gpa, "groupId": groupId};
    console.log(JSON.stringify(new_group));
    $.ajax({
        type: "PUT",
        url: host + "/students",
        data: JSON.stringify(new_group),
        contentType: 'application/json',
        success: function (data) {
            RenderStudents(getUrlParameter("group"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
}
function AddStudent(name, gpa, groupId) {
    var new_group = {"name": name, "gpa": gpa, "groupId": groupId};
    console.log(JSON.stringify(new_group));
    $.ajax({
        type: "POST",
        url: host + "/students",
        data: JSON.stringify(new_group),
        contentType: 'application/json',
        success: function (data) {
            RenderStudents(getUrlParameter("group"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
        }
    });
}
function RenderGroups(param) {
    $("#stud-body").empty();
    if (param == undefined) param = "";
    $.ajax({
        type: "GET",
        url: host + "/groups" + param,
        dataType: "json",
        success: function (data) {
            DrawGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
}
function DeleteGroup(param) {
    if (param == undefined) param = "";
    $.ajax({
        type: "DELETE",
        url: host + "/group/id" + param,
        success: function (data) {
            RenderGroups();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
}
function EditGroup(id, name, grad) {
    var new_group = {"groupId": id, "name": name, "graduationDate": grad};
    console.log(JSON.stringify(new_group));
    $.ajax({
        type: "PUT",
        url: host + "/groups",
        data: JSON.stringify(new_group),
        contentType: 'application/json',
        success: function (data) {
            RenderGroups();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
}
function AddGroup(name, grad) {
    var new_group = {"name": name, "graduationDate": grad};
    console.log(JSON.stringify(new_group));
    $.ajax({
        type: "POST",
        url: host + "/groups",
        data: JSON.stringify(new_group),
        contentType: 'application/json',
        success: function (data) {
            RenderGroups();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
}
function GetAvgMark(groupId) {
    var resp = $.ajax({
        type: "GET",
        url: host + "/students/gpa?groupId=" + groupId,
        async: false,
        success: function (data) {
            //alert(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
    return resp.responseText;


}
function RenderGroupInfo(id) {
    $.ajax({
        type: "GET",
        url: host + "/groups/id" + id,
        dataType: "json",
        success: function (data) {
            DrawGroupInfo(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
        }
    });
}
function GetGroupById(id) {
    var resp = $.ajax({
        type: "GET",
        url: host + "/groups/id" + id,
        dataType: "json",
        async: false,
        success: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
            
        }
    });
    return JSON.parse(resp.responseText).name;
}
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function DrawException(exception) {
    $(".app").css({
        filter: "blur(2px)"
    });
    console.log(exception);
    $(".modal-body, .modal-footer, .modal-header ").empty();

        var typeOfError = "Please check your input";
        var exceptionText = exception.responseText;

        if (exceptionText != undefined) exceptionText = exceptionText.replace('IllegalArgumentException: ', '');
        else {
            exceptionText = "No connection";
            typeOfError = "Critical error"
        }

        $(".modal-header").append('<p class="big-text">' + typeOfError + '</p>');
        $(".modal-body").append('<p class="some-info break">' + exceptionText +'</p>');
        $(".modal-footer").append('<button id="cancel" class="button small green" onclick="CloseModal()">Ok</button>');

    $(".modal_back").addClass("visible-modal");

}


