$(function() {


    //add text input field
    $('#addButton1').click(function() {

        //get number of elements 
        var len = $('#section div').length; 

        //create empty div to hold input fields
        var element = $('<div/>').attr({
            id: 'element' + len
        }).css({
            width: '100%',
            marginBottom: '20px'
        }); 

        //create input field for teacher_input
        var teacher_input = $('<input/>').attr({
            type: 'text',
            name: 'text '+len,
            placeholder: 'Skriv en titel til indtastningsfeltet'
        }).width('40vw'); 

        //create text label for student_input
        var student_input = $('<span/>').css({
            marginLeft: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            border: "1px solid black"
        }).text('Her kommer kursistens svarfelt til at være'); 

        //append elements
        element.append(teacher_input).append(student_input);
        $('#section').append(element); 
    }); 



    //add checkbox input
    $('#addButton2').click(function() {

        //get number of elements 
        var len = $('#section div').length;
        //create empty div to hold input fields
        var element = $('<div/>').attr({
            id: 'element' + len
        }).css({
            width: '100%',
            marginBottom: '20px'
        });

        //create input field for teacher_input
        var teacher_input = $('<input/>').attr({
            type: 'text',
            name: 'checkbox '+len+ ' text',
            placeholder: 'Skriv en titel til afkrydsningsfeltet'
        }).width('40vw');

        var add_checkbox = $('<button/>').attr({
            type: 'button',
            id: 'checkbox_button' + len
        }).text('Tilføj svarmulighed').click(function() {
            addCheckbox(this.id); 
        }); 

        var rem_checkbox = $('<button/>').attr({
            type: 'button',
            id: 'checkbox_remove_button' + len
        }).text('Fjern svarmulighed').click(function() {
            remCheckbox(this.id); 
        }); 

        var checkbox_element = $('<span/>').attr({
            id: 'checkbox_element' + len
        }).css({
            width: '100%'
        }); 

        element
            .append(teacher_input)
            .append(add_checkbox)
            .append(rem_checkbox)
            .append('<br>')
            .append(checkbox_element); 
        $('#section').append(element); 

        addCheckbox('checkbox_button' + len);
    }); 

    function addCheckbox(id) {
        var id = id.substring(15);
        var leng = $('#checkbox_element'+id+' input').length; 

        var checkbox_input = $('<input/>').attr({
            type: 'text',
            name: 'checkbox '+id+' '+leng,
            id: 'checkbox'+id+'_'+leng,
            placeholder: 'Skriv en tekst til svarmuligheden'
        }).width('20vw');

        var block = $('<span/>').css({
            "display": "block",
            "width": "100%"
        }); 
        block.append(checkbox_input);
        
        $('#checkbox_element'+id).append(block); 
    }

    function remCheckbox(id) {
        var id = id.substring(22);
        if($('#checkbox_element'+id+' span').length > 1) {
            $('#checkbox_element'+id+' span').last().remove(); 
        }
    }



    //add radio input
    $('#addButton3').click(function() {
        
        //get number of elements 
        var len = $('#section div').length;
        //create empty div to hold input fields
        var element = $('<div/>').attr({
            id: 'element' + len
        }).css({
            width: '100%',
            marginBottom: '20px'
        });

        //create input field for teacher_input
        var teacher_input = $('<input/>').attr({
            type: 'text',
            name: 'radio '+len+' text',
            placeholder: 'Skriv en titel til radioknapperne'
        }).width('40vw'); 

        var add_radio = $('<button/>').attr({
            type: 'button',
            id: 'radio_button' + len
        }).text('Tilføj svarmulighed').click(function() {
            addRadio(this.id); 
        }); 

        var rem_radio = $('<button/>').attr({
            type: 'button',
            id: 'radio_remove_button' + len
        }).text('Fjern svarmulighed').click(function() {
            remRadio(this.id); 
        }); 

        var radio_element = $('<span/>').attr({
            id: 'radio_element' + len
        }).css({
            width: '100%'
        }); 

        element
            .append(teacher_input)
            .append(add_radio)
            .append(rem_radio)
            .append('<br>')
            .append(radio_element); 
        $('#section').append(element);

        addRadio('radio_button' + len);
    }); 

    function addRadio(id) {
        var id = id.substring(12);
        var leng = $('#radio_element'+id+' input').length; 

        var radio_input = $('<input/>').attr({
            type: 'text',
            name: 'radio '+id+' '+leng,
            id: 'radio'+id+'_'+leng,
            placeholder: 'Skriv en tekst til svarmuligheden'
        }).width('20vw');

        var block = $('<span/>').css({
            "display": "block",
            "width": "100%"
        }); 
        block.append(radio_input);
        
        $('#radio_element'+id).append(block); 
    }

    function remRadio(id) {
        var id = id.substring(19);
        if($('#radio_element'+id+' span').length > 1) {
            $('#radio_element'+id+' span').last().remove(); 
        }
    }



    //add dropdown input
    $('#addButton4').click(function() {
        
        //get number of elements 
        var len = $('#section div').length;
        //create empty div to hold input fields
        var element = $('<div/>').attr({
            id: 'element' + len
        }).css({
            width: '100%',
            marginBottom: '20px'
        });

        //create input field for teacher_input
        var teacher_input = $('<input/>').attr({
            type: 'text',
            name: 'dropdown '+len+' text',
            placeholder: 'Skriv en titel til dropdown menuen'
        }).width('40vw');

        var add_dropdown = $('<button/>').attr({
            type: 'button',
            id: 'dropdown_button' + len
        }).text('Tilføj dropdown element').click(function() {
            addDropdown(this.id); 
        }); 

        var rem_dropdown = $('<button/>').attr({
            type: 'button',
            id: 'dropdown_remove_button' + len
        }).text('Fjern dropdown element').click(function() {
            remDropdown(this.id); 
        }); 

        var dropdown_element = $('<span/>').attr({
            id: 'dropdown_element' + len
        }).css({
            width: '100%'
        }); 

        element
            .append(teacher_input)
            .append(add_dropdown)
            .append(rem_dropdown)
            .append('<br>')
            .append(dropdown_element); 
        $('#section').append(element);

        addDropdown('dropdown_button' + len); 
    }); 

    function addDropdown(id) {
        var id = id.substring(15);
        var leng = $('#dropdown_element'+id+' input').length; 

        var dropdown_input = $('<input/>').attr({
            type: 'text',
            name: 'dropdown '+id+' '+leng,
            id: 'dropdown'+id+'_'+leng,
            placeholder: 'Skriv en tekst til dropdown elementet'
        }).width('20vw');

        var block = $('<span/>').css({
            "display": "block",
            "width": "100%"
        }); 
        block.append(dropdown_input);
        
        $('#dropdown_element'+id).append(block); 
    }

    function remDropdown(id) {
        var id = id.substring(22);
        if($('#dropdown_element'+id+' span').length > 1) {
            $('#dropdown_element'+id+' span').last().remove();
        } 
    }



    //remove latest input field
    $('#removeButton').click(function() {
        $('#section div').last().remove();         
    }); 





}); 