var Events = {
  path: unescape(document.location.pathname).split('/'),
  
  init: function () {
    this.db = $.couch.db(this.path[1]);
    this.design_doc = this.path[3];
    this.hide_message();
    this.show();
    this.register_event_handler();
  },
  
  register_event_handler: function () {
    var that = this;
    $('#navigation ul li').live('click', function () {
      if ($(this).hasClass('js_events')) {
        that.show();
      }
      
      if ($(this).hasClass('js_create_event')) {
        that.create();
      }
    });
    
    $('.js_submit').live('click', function (e) {
      e.preventDefault();
      that.save();
    });
    
    $('.js_delete').live('click', function (e) {
      e.preventDefault();
      var id = JSON.parse($(this).attr('title'));
      that.delete_data(id);
    })
  },
  
  show: function () {
    this.db.view(this.design_doc + "/events", {
      descending: "true",
      limit: 20,
      update_seq: true,
      success: function (data) {
        var partial = $.mustache($("#events").html(), {  
            event: data.rows.map(function (res) {
              return res.value;              
            })
        })
        $('#content').html(partial).show();
      }
    })
  },
 
  save: function () {
    var data = $('#save_event_form').serializeArray(),
        data_to_save = {},
        that = this;
    
    $.each(data, function (i, elm) {
      data_to_save[elm.name] = elm.value;
    }); 
    
    data_to_save = JSON.parse(JSON.stringify(data_to_save));

    this.db.saveDoc(data_to_save, {
      success: function () {
        that.show_message('Datensatz erfolgreich gespeichert.');
        that.reset();
        that.show();
      },
      error: function () {
        that.show_message('Fehler beim speichern der Daten.');
      }
    });
  },
 
  create: function () {
    this.hide_message();
    var partial = $.mustache($("#create_event").html(), {});
    $("#content").html(partial).show();
  },
  
  delete_data: function (doc) {
    var that = this;
    
    this.db.removeDoc(doc, {
      success: function () {
        that.show_message('Datensatz erfolgreich entfernt.');
        that.show();
      },
      error: function () {
        that.show_message('Fehler beim Entfernen des Datensatz.');
      }
    });
  },
  
  reset: function () {
    $('#save_event_form input').filter(':text').val('');
  },
  
  hide_message: function () {
    $('span.message').html('').hide();
  },
  
  show_message: function (message) {
    $('span.message').html(message).show();
  }
}

$('document').ready(Events.init());