var gulp = require("gulp");
var del = require("del");

var paths = {
	scripts: ["src/**/*.ts", "src/**/*.js", "src/**/*.map"]
};

gulp.task("clean", function() {
	return del(["dist/**/*"]);
});

gulp.task("build", (done) => {
	gulp.src(paths.scripts)
		.pipe(gulp.dest("dist"))
	;
	done();
});
