<?php 
  putenv("ROOT=/TourGuru_v2");
?>
    <link rel="icon" href="<?php echo getenv('ROOT')?>/shared/assets/images/logo.svg">
    <link href="<?php echo getenv('ROOT')?>/shared/css/style.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-kQtW33rZJAHjgefvhyyzcGF3C5TFyBQBA13V1RKPf4uH+bwyzQxZ6CmMZHmNBEfJ"
      crossorigin="anonymous"
    ></script>
    
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js"
      integrity="sha512-n/4gHW3atM3QqRcbCn6ewmpxcLAHGaDjpEBu4xZd47N0W2oQ+6q7oc3PXstrJYXcbNU1OHdQ1T7pAP+gi5Yu8g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    
    <nav class="navbar navbar-expand-sm navbar-light">
        <a class="nav-link active" aria-current="page" href="<?php echo getenv('ROOT')?>"
          ><img src="<?php echo getenv('ROOT')?>/shared/assets/images/logo.svg" id="logo"
        /></a>
        <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
          <ul class="navbar-nav mr-auto mt-lg-0">
            <li class="nav-item me-4 main-nav-item">
              <a class="nav-link" id="nav-flight" aria-current="page" href="<?php echo getenv('ROOT')?>/flights"><span>Flights</span></a>
            </li>
            <li class="nav-item me-4 main-nav-item">
              <a class="nav-link" id="nav-hotel" aria-current="page" href="<?php echo getenv('ROOT')?>/hotels"><span>Hotels</span></a>
            </li>
            <li class="nav-item me-4 main-nav-item">
              <a class="nav-link" id="nav-attraction" aria-current="page" href="<?php echo getenv('ROOT')?>/attraction"
                ><span>Attractions</span></a
              >
            </li>
          </ul>

          <ul id="header-not-logged-in" class="navbar-nav float-lg-right">
            <li class="nav-item active">
                <a class="nav-link sign-in" href="<?php echo getenv('ROOT')?>/auth"><i class="fa fa-user-plus" aria-hidden="true"></i> join us</a>
            </li>
          </ul>
                
          <ul class="navbar-nav float-lg-right" id="header-logged-in">
            <p id="business-name">
              Vietnam Airlines
            </p>
            
            <!-- Avatar -->
            <li class="nav-item dropdown dropdown-menu-right dropdown-menu-end">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src=""
                  class="rounded-circle"
                  height="22"
                  alt=""
                  loading="lazy"
                  id="profile-img"
                />
              </a>

              <ul class="dropdown-menu dropdown-menu-right dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                <div id="business-dropdown">
                  <li>
                    <a class="dropdown-item" href="<?php echo getenv('ROOT')?>/business/profile/edit"><i class="fas fa-edit"></i> Edit business profile</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="<?php echo getenv('ROOT')?>/business/profile/password-reset"><i class="fa fa-key" aria-hidden="true"></i> Change password</a>
                  </li>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" id="log-out"><i class="fa fa-sign-out-alt"></i> Log out</a>
                </div> 
                <div id="user-dropdown">
                  <li>
                      <a class="dropdown-item" href="<?php echo getenv('ROOT')?>/user_dashboard"><i class="fa fa-th-list" aria-hidden="true"></i> My dashboard</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="<?php echo getenv('ROOT')?>/plans"><i class="fa fa-calendar" aria-hidden="true"></i> My plans</a>
                    </li>
                  <div class="dropdown-divider"></div>
                  <li>
                    <a class="dropdown-item" href="<?php echo getenv('ROOT')?>/profile/edit"><i class="fas fa-edit"></i> Edit profile</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="<?php echo getenv('ROOT')?>/profile/password-reset"><i class="fa fa-key" aria-hidden="true"></i> Change password</a>
                  </li>
                  <div class="dropdown-divider"></div>
                  <div id="admin-header-block">
                    <li>
                      <a class="dropdown-item" href="<?php echo getenv('ROOT')?>/admin_dashboard"><i class="fas fa-chart-line"></i> Management</a>
                    </li>
                    <div class="dropdown-divider"></div>
                  </div>
                  <a class="dropdown-item" href="#" id="log-out"><i class="fa fa-sign-out-alt"></i> Log out</a>
                </div>
              </ul>
            </li>
          </ul>            
        </div>
    </nav>

    <script src="<?php echo getenv('ROOT')?>/shared/js/header.js"></script>

    <script>
        //Hide 000webhost panel
        let getPanel = document.querySelector("div[style*='z-index:9999999;']");
        if (getPanel != null) {
            getPanel.style = "display: none;"
        }
    </script>