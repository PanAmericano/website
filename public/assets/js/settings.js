 $(document).ready(function() {
   $("#player").click(function(e) {
   e.preventDefault();
   $("#player").html('<iframe width="853" height="480" src="https://www.youtube.com/embed/?listType=playlist&list=PLwCbMb-X3S5J99BLtOoBWRA4w0bExrQd-&autoplay=1" frameborder="0" allowfullscreen></iframe>');
  });
});
