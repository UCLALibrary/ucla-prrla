/**
 * Created by KVS on 20.04.2017.
 */
$(document).ready(function(){


    $('.filter-list .list-item-title').click(function (e) {
        e.preventDefault();
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).next('.filter-block').slideUp(800);
        }else{
            $(this).addClass('active');
            $(this).next('.filter-block').slideDown(800);
        }
        // $(this).toggleClass('active').animation(1000);
    });
    // console.log('test kurvamach');

});