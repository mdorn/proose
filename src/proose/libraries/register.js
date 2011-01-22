function register(cls, params, attributes) {
    namespace = application.globals.get('proose.settings.namespace')
    // don't have access to cls.class.getName() in JS, hence regex
    clsname = String(cls).match(/ (.*)]/)[1]
    globname = namespace + '.' + clsname
    globinst = application.globals.get(globname)
    if (!globinst) {
        if (params) {
            var instance = new cls(params)
        } else {
            var instance = new cls()
        }
        var cls = instance.getClass()
        // can't use java.lang.Class in Rhino, hence no getMethod()
        var methods = cls.getMethods()
        var method_names = []
        for (m in methods) {
            method_names[m] = String(methods[m].getName())
        }
        for (a in attributes) {
            method_index = method_names.indexOf(a)
            method = methods[method_index]
            method.invoke(instance, attributes[a])
        }
        globinst = application.getGlobal(globname, instance)
    }
    return globinst
}