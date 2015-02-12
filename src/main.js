require([], function() {
  "use strict";

  var themeLight = true;

  var createPlayer = function() {
    var list, channel, listenkey, player, volume;

    list = $('select[name=channel]')[0];
    channel = list.options[list.selectedIndex].value;

    listenkey = $("input#listenkey").val();

    if (listenkey == "" || channel == "" || channel === "channel") {
      return;
    }

    window.localStorage.setItem('di.listenkey', listenkey);
    window.localStorage.setItem('di.channel', channel);

    // If the existing audio player has a volume set, lets re-use it.
    // Otherwise we're likely loading the page for the first time,
    // and we default to a saved value.
    volume = $('audio#player').prop("volume");
    if (volume === undefined) {
      volume = window.localStorage.getItem('di.volume');
    }

    player = '<audio id="player" controls autoplay><source src="//prem1.di.fm:80/' + channel + '?' + listenkey + '"></audio>';

    $('.player').html(player);

    // If the player has a problem, simply try to restart it.
    $('audio#player').on('error', function(e) {
      console.log('di.fm closed the connection. :( Waiting a second, and then restarting player');
      setTimeout(createPlayer, 1000);
    });

    if (volume !== undefined) {
      $('audio#player').prop("volume", volume);
    }

    $('audio#player').on('volumechange', function(e) {
      window.localStorage.setItem('di.volume', $('audio#player').prop("volume"));
    });

    var interval = setInterval(function() {
      var currentVolume = $('audio#player').prop("volume");
      var target = window.localStorage.getItem('di.volume');
      var diff = target - currentVolume;
      var increment = 0.05;

      if (Math.round(diff) <= increment) {
        clearInterval(interval);
      }
      $('audio#player').prop("volume", currentVolume + increment)
    }, 250);
    // window.localStorage.setItem('di.volume', $('audio#player').prop("volume"));
  }

  var switchTheme = function () {
    var newLink = '//thomasf.github.io/solarized-css/solarized-light.min.css';
    if (themeLight) {
      newLink = '//thomasf.github.io/solarized-css/solarized-dark.min.css';
    }
    themeLight = !themeLight;

    $('link[href*="solarized-css"]').attr('href', newLink);
  }

  $(document).ready(function() {
    $('select[name=channel]').change(createPlayer);

    var listenkey = window.localStorage.getItem('di.listenkey');
    if (listenkey !== null) {
      $("input#listenkey").val(listenkey);
    }

    var channel = window.localStorage.getItem('di.channel');
    if (channel !== null) {
      $('select[name=channel]').val(channel);
        createPlayer();
      };

      $('.themeswitcher').on("click", function() { switchTheme.apply(this) });
  });
});
