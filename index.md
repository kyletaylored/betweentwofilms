---
layout: default
---

<h1>#betweentwomovies</h1>
<p>{{ site.description | escape }}</p>
<form class="form text-center" id="movie-form" name="movie-form">
	<h1 class="h3 mb-3 font-weight-normal">Enter your cosmic origin date:</h1>
	<div class="row">
	<div class="col-md-12 mb-4 col-md-offset-4">
    	<div class="form-group">
            <div class='input-group date' id='datetimepicker'>
                <input type='text' class="form-control" name="birthday" />
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
	</div>
    </div>
    <div class="row">
    	<div class="custom-control custom-checkbox">
    		<input type="checkbox" class="custom-control-input" id="notfamous">
    		<label class="custom-control-label" for="notfamous"><em style="font-weight: normal"> (I don't care if they're famous movies)</em></label>
    	</div>
    </div>
    <div class="row mb-3">
		<div class="col-md-12">
    	<button class="btn btn-lg btn-primary btn-block" style="margin-top:1em" type="submit">Find your movies</button>
		</div>
    </div>
    <div class="loading-wrapper hidden row">
        <div class="loading col-md-6 col-md-offset-3"> 🥊</div>
        <div class="col-md-6 col-md-offset-3">
            <br> <em>retrieving birth records...</em>
        </div>
    </div>
    <div class="fighter"></div>

</form>
