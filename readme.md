
FindMyBand
User Narrative:
This is a really cool application which will allow users to either promote your music (bands) OR find local music in the area, also it will allows users to find cool bands near your area referencing your zip code.


<div class="container">
		<button type="button" class="btn btn-primary btn-lg">Add New Band</button>
	</div>

	<!--Add Band Modal-->
<div id="add-band" class="modal fade" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Add New Band</h4>
			</div>
			<div class="modal-body">
				<div class="bold">
					Name
				</div>
				<div class="margin-top-20">
					<input id="name" type="text" class="form-control" />
				</div>
				<div class="bold">
					Genre
				</div>
				<div class="margin-top-20">
					<input id="genre" type="text" class="form-control" />
				</div>
				<div class="bold">
					ZipCode
				</div>
				<div class="margin-top-20">
					<input id="zip_code" type="text" class="form-control" />
				</div>
				<div class="bold margin-top-20">
					About
				</div>
				<div class="margin-top-20">
					<textarea id="about" class="form-control"></textarea>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button id="submit-Band" type="button" class="btn btn-primary">Save Band</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!--/Add Wine Modal-->
	