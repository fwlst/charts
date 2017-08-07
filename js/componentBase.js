/*  基本图文组件  */
(function (win) {
    function ComponentBase(name,cfg) {
        var ops = cfg || {},
            id = ('base_c_' + Math.random()).replace('.','_'),
            clsN = ' component_name_'+ name + ' component_' + cfg.type ;


        var component  = $('<div id='+ id +' class="h5_component '+ clsN +'"></div>');



        ops.text && component.text(ops.text);
        ops.width && component.width(ops.width/2);
        ops.height && component.height(ops.height/2);
        ops.css && component.css(ops.css);
        ops.bg && component.css({'background-image': 'url('+ ops.bg +')'});

        //剧中
        if(cfg.center){
            component.css({
                'margin-left': (cfg.width/4 * -1),
                'left': '50%'
            });
        }
        component.on('onLoad', function () {
            $(this).css(cfg.anInCss);
            return false;
        });
        component.on('onLeave', function () {
            $(this).css(cfg.anOutCss);
            return false;
        });




        return component;
    }
    win.ComponentBase = ComponentBase;
})(window);