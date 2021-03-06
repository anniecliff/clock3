<!-- Content Wrapper. Contains page content -->

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            Who's Around Today
            <small></small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="<?php echo base_url();?>ccattendance/attendance/whosaroundtoday"><i class="fa fa-users"></i> Who's Around Today</a></li>
        </ol>
    </section>

    <!-- Main content -->
    <section class="content">


        <div class="row">

            <div class="col-md-4">
                <!-- USERS LIST -->
                <div class="box box-default">
                    <!-- /.box-header -->
                    <form  role="form" id="frm_who_around" name="frm_who_around" action="<?php echo base_url();?>ccattendance/attendance/whosaroundtoday" method="post" >
                    <div class="box-body">
                        <div class="form-group">
                            <label>Select Shift</label>
                            <select name="shifts" id="shifts" onchange="document.getElementById('shift_id').value	=this.value;document.getElementById('frm_who_around').submit();" data-placeholder="-- Select A Shift* --"  class="form-control select2" style="width: 100%;" >
					                  <option value="all" <?php echo (isset($shifts) && ($shifts=='all')? 'selected="selected"' : set_select('shifts','all'));?> >-- All Shifts --</option>
					                  <?php foreach($company_shifts as $shift){?>
					                  <option value="<?php echo $shift->shift_id;?>" <?php echo (isset($shifts) && ($shifts==$shift->shift_id)? 'selected="selected"' : set_select('shifts',$shift->shift_id));?> >
					                  <?php echo $shift->shift_name;?>
					                  </option>
					                  <?php } ?> 
					             </select>
                        </div>
                        <input type="hidden" name="shift_id"  id="shift_id" value=""/>
	         				<input type="hidden" name="<?=$this->security->get_csrf_token_name()?>" value="<?=$this->security->get_csrf_hash()?>" />
                        <!-- /.form-group -->
                    </div>
                    </form>
                    <!-- /.box-body -->
                </div>
                <!--/.box -->
            </div>
            <!-- /.col-md-4 -->
        </div>
        <!--/row-->


        <div class="row">
				<?php echo (isset($department_attendance)) ? $department_attendance :'Please Select A Shift'; ?> 

        </div>
        <!-- /.row -->


    </section>
    <!-- /.content -->
</div>
<!-- /.content-wrapper -->


