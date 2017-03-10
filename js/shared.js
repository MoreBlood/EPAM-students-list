$(document).ready(function () {

    $('.table-holder').css({
        marginTop : $('.navigation').height()
    });
    $('.table-gr').stickyTableHeaders({fixedOffset: $('.navigation').height()});
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
    $("#stud-body").empty();
    var name = $('#new-st-name').val(), mark = $('#new-st-mark').val(), group = $('#new-st-group option:selected').attr('gr-id');
    EditStudent(id, name, mark, group);
    CloseModal();
}
function AddSt() {
    $("#stud-body").empty();
    var name = $('#new-st-name').val(), mark = $('#new-st-mark').val(), group = $('#new-st-group option:selected').attr('gr-id');
    group = getUrlParameter("group");
    AddStudent(name, mark, group);
    CloseModal();
}
function DeleteSt(id) {
    $("#stud-body").empty();
    DeleteStudent(id);
    CloseModal();
}
function filterStud() {
    $("#stud-body").empty();
    RenderStudents("?minGpa=" + $("#mark-range-left").val() + "&maxGpa=" + $("#mark-range-right").val());
    CloseModal();

}
function DeleteGr(id) {
    $("#stud-body").empty();
    DeleteGroup(id);
    CloseModal();
}
function EditGr(id) {
    $("#stud-body").empty();
    var name = $('#new-group-name').val(), grad = $('#new-group-grad').val();
    EditGroup(id, name, grad);
    CloseModal();
}
function AddGr() {
    $("#stud-body").empty();
    var name = $('#new-group-name').val(), grad = $('#new-group-grad').val();
    AddGroup(name, grad);
    CloseModal();
}
function UpdateGr() {
    $("#stud-body").empty();
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
        }
    });
}
function RenderGroups(param) {
    if (param == undefined) param = "";
    $.ajax({
        type: "GET",
        url: host + "/groups" + param,
        dataType: "json",
        success: function (data) {
            DrawGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('Нет такой группы с id: ' + id);
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
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
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

