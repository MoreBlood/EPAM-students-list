$(document).ready(function () {
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




function show_edit_center(type, id,name,mark,group) {
    $(".app").css({
        filter: "blur(2px)"
    });

    $(".modal-body, .modal-footer, .modal-header ").empty();

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
        $(".modal-footer").append('<button id="edit-gr" class="button small gray" onclick="EditSt(' + id + ')">Save</button>');
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
        $(".modal-body").append('<p class="some-info">You can\'t undo this!</p>');
        $(".modal-footer").append('<button id="cancel" class="button small green" onclick="CloseModal()">Cancel</button>' +
            '<button id="delete-gr" class="button small red" onclick="DeleteSt(' + id + ')">Delete</button>');
    }


    $(".modal_back").addClass("visible-modal");

}
function RenderStudents(param) {
    $("#stud-body").empty();
    if (param == undefined) param = "";
    $.ajax({
        type: "GET",
        url: host + "/students" + param ,
        dataType: "json",
        success: function (data) {
            DrawGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            DrawException(jqXHR);
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
function AddSt() {
    var name = $('#new-st-name').val(), mark = $('#new-st-mark').val(), group = $('#new-st-group option:selected').attr('gr-id');
    AddStudent(name, mark, group);
    CloseModal();
}