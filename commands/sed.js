function sedStr (str, arg) {
    let str_ = str;
    let arg_ = arg;
    arg_ = arg_.split ('/');
    if (typeof (arg_[1]) == 'undefined' ||
        (arg_[0].length < 1 || arg_[1].length < 1)) {
    } else {
        try{
            re = new RegExp (arg_[0], "gi");
            str_ = str_replace (re, arg_[1]);
        } catch (e) {
            // Hello, smile
        }
    }

    return str_;
}

exports.run = function sed (str, arg_arr) {
    let clean = str;
    for (i in arg_arr) {
        clean.embed.description = sedStr (clean.embed.description, arg_arr[i]);
    }
    return clean;
}

