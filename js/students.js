var host = "http://localhost:8088";

$(document).ready(function () {

    var groupId = getUrlParameter("group");

    //if (groupId == undefined) groupId = "all";

    RenderStudents();

    $('#add-btn').click(function () {
        show_edit_center("add");
    });
    $('#filter').click(function () {
        show_edit_center("filter");

    });
    $('.close-background, #close-bg').click(function () {

        CloseModal();
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
    $('#stud-body').on("click", ".small-button.edit",  function () {
        var id = $(this).parent().find(".gr-name").attr("st-id");
        var name = $(this).parent().find(".gr-name").html();
        var mark = $(this).parent().parent().find(".mid-td").html();
        var group = $(this).parent().parent().find(".left-td.first.mid").html();

        show_edit_center("edit", id, name, mark, group);

    });
    $('#stud-body').on("click", ".small-button.delete",  function () {
        var id = $(this).parent().find(".gr-name").attr("st-id");
        var name = $(this).parent().find(".gr-name").html();
        show_edit_center("delete", id, name);
    });

    $('#stud-body').on("click", "td.left-td.first.mid",  function (e) {
        window.location.href = "group.html?group=" +$(this).attr("gr-id");

    });


});

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
function filterStud() {
    $("#stud-body").empty();
    RenderStudents("?minGpa=" + $("#mark-range-left").val() + "&maxGpa=" + $("#mark-range-right").val());
    CloseModal();

}

function DeleteSt(id) {
    $("#stud-body").empty();
    DeleteStudent(id);
    CloseModal();
}
function show_edit_center(type, id,name,mark,group) {
    $(".app").css({
        filter: "blur(2px)"
    });

    $(".modal-body").empty();
    $(".modal-footer").empty();
    $(".modal-header").empty();

    if (type === "edit"){
        var groups =  JSON.parse(GetGroups());
        var selects = "";
        for (var gr in groups){
            selects += '<option gr-id="' + groups[gr].groupId + '">' + groups[gr].name + '</option>'
        }
        $(".modal-header").append('<p class="big-text">Edit Student ' + name + '</p>');
        $(".modal-body").append('<br><div class="input-name-holder">' +
            '<input type="text" id="new-st-name" class="input r-border" placeholder="Student name" value="' + name +'">' +

            '<div class="input name"><p class="name-p">Name</p></div></div><br>'+

            '<div class="input-name-holder">' +
            '<input type="text" id="new-st-mark" name="" class="input r-border" placeholder="8.9" value="' + mark +'">' +
            '<div class="input name"><p class="name-p">Mark</p></div></div><br>'+

            '<select id="new-st-group" class="select-modal">' + selects+
            '</select>'+
            '</div><br><br>');
        $(".select-modal").val(group);
        $(".modal-footer").append('<button id="edit-gr" class="button small gray" onclick="EditSt(' + id + ')">Edit</button>');
    }
    if (type === "add"){
        var groups =  JSON.parse(GetGroups());
        var selects = "";
        for (var gr in groups){
            selects += '<option gr-id="' + groups[gr].groupId + '">' + groups[gr].name + '</option>'
        }
        $(".modal-header").append('<p class="big-text">Add new student</p>');
        $(".modal-body").append('<br><div class="input-name-holder">' +
            '<input type="text" id="new-st-name" class="input r-border" placeholder="Student name"">' +

            '<div class="input name"><p class="name-p">Name</p></div></div><br>'+

            '<div class="input-name-holder">' +
            '<input type="text" id="new-st-mark" name="" class="input r-border" placeholder="8.9">' +
            '<div class="input name"><p class="name-p">Mark</p></div></div><br>'+

            '<select id="new-st-group" class="select-modal">' + selects+
            '</select>'+
            '</div><br ><br >');
        $(".select-modal").val(groups[0].name);
        $(".modal-footer").append('<button id="edit-gr" class="button small gray" onclick="AddSt()">Add</button>');
    }
    if (type === "filter"){
        $(".modal-header").append('<p class="big-text">Filter by marks</p>');
        $(".modal-body").append('<br>' +
        '<input type="text" id="mark-range-left" name="" class="input r-border" placeholder="8.9">'+
            '<input type="text" readonly id="mark-range-between" name="" class="input r-border" value="...">' +
            '<input type="text" id="mark-range-right" name="" class="input r-border" placeholder="8.9"><br><br>'+
            '<div id="slider-range"></div><br>');
        $(".modal-footer").append('<button id="update-gr" class="button small gray" onclick="filterStud()">Filter</button>');
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 10,
            values: [ 2, 7 ],
            slide: function( event, ui ) {
                $( "#mark-range-left" ).val( ui.values[ 0 ]);
                $( "#mark-range-right" ).val( ui.values[ 1 ]);
            }
        });
        $( "#mark-range-left" ).val( $( "#slider-range" ).slider( "values", 0 ));
        $( "#mark-range-right" ).val( $( "#slider-range" ).slider( "values", 1 ));

    }
    if (type === "delete"){
        $(".modal-header").append('<p class="big-text">Delete student ' + name + '?</p>');
        $(".modal-body").append('<p class="some-info">Information will be deleted</p>');
        $(".modal-footer").append('<button id="cancel" class="button small green" onclick="CloseModal()">Cancel</button>' +
            '<button id="delete-gr" class="button small red" onclick="DeleteSt(' + id + ')">Delete</button>');
    }


    $(".modal_back").addClass("visible-modal");

}

function RenderStudents(param) {
    if (param == undefined) param = "";
    $.ajax({
        type: "GET",
        url: host + "/students" + param ,
        dataType: "json",
        success: function (data) {
            DrawGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('Нет такой группы с id: ' + param);
        }
    });

}


function DrawGroups(data) {
    avg = 0;
    for (var student in data) {
        $("#stud-body").append('<tr class="tr-gr hover"> <td class="left-td first"><span class="gr-name" st-id="' + data[student].studentId + '">'
            + data[student].name +'</span><span class="small-button edit"></span>'+'<span class="small-button delete"></span>' +
            '</td>' + '<td class="left-td first mid" gr-id="' + data[student].groupId  + '">' + GetGroupById(data[student].groupId) + '</td>' + '<td class="mid-td">' + data[student].gpa + '</td> </tr>');
        avg += data[student].gpa;
    }
    $("#num-stud").html(data.length);
    $("#avg-mark").html((avg/data.length).toFixed(2));
}


function GetGroupById(id) {
    var resp = $.ajax({
        type: "GET",
        url: host + "/groups/id" + id,
        dataType : "json",
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
    var new_group = {"studentId" : studentId, "name" : name, "gpa": gpa, "groupId": groupId};
    console.log(JSON.stringify(new_group));
    $.ajax({
        type: "PUT",
        url: host + "/students",
        data : JSON.stringify(new_group),
        contentType : 'application/json',
        success: function (data) {
            RenderStudents(getUrlParameter("group"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
        }
    });
}
function GetGroups() {
    var resp = $.ajax({
        type: "GET",
        url: host + "/groups",
        dataType : "json",
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

function AddStudent(name, gpa, groupId) {
    var new_group = {"name" : name, "gpa": gpa, "groupId": groupId};
    console.log(JSON.stringify(new_group));
    $.ajax({
        type: "POST",
        url: host + "/students",
        data : JSON.stringify(new_group),
        contentType : 'application/json',
        success: function (data) {
            RenderStudents(getUrlParameter("group"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
        }
    });
}
var getUrlParameter = function getUrlParameter(sParam) {
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
};