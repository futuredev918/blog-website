"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("../models/users"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _category = _interopRequireDefault(require("../models/category"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _savetext = _interopRequireDefault(require("../models/savetext"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _htmlToText = _interopRequireDefault(require("html-to-text"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _flag = _interopRequireDefault(require("../models/flag"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var _media = _interopRequireDefault(require("../models/media"));

var _bodyParser = require("body-parser");

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireWildcard(require("fs"));

var edjsHTML = require("editorjs-html");

var edjsParser = edjsHTML();

var router = _express["default"].Router();

// Create a new article
function createMedia(string) {
  var name = "".concat(Date.now().toString(), ".png");
  var dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", "".concat(name)));
  var data = string.replace('data:application/octet-stream;base64', '');
  var fileContents = new Buffer(data, 'base64');

  var file = _fs["default"].writeFileSync(dest, fileContents);

  var profilePicture = "/media/".concat(name);
  return profilePicture;
}

router.post("/article/create", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var article_header, header_url, noindex, receive, data, user, article_title, search, real, array, articleslug, meta_title, meta_description, _real, _array, _articleslug, set, newDate, months, parse, html, result, payload1, createdArticle;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // temp
            // let articles = await Article.find({});
            // articles.forEach(async article => {
            //   var data = article.body;
            //   var result = changeTohtml(data);
            //   Article.updateOne({ _id: article._id }, { $set: { articleTablecontent: result.table_content, articleBody: result.article } }).then(data => {
            //   }).catch(error => {
            //     console.log(error);
            //   });
            // });
            article_header = req.body.article_header;
            header_url = createMedia(article_header);
            noindex = req.body.articlenoindex;
            receive = JSON.parse(req.body.data);
            data = receive.blocks;
            _context.next = 7;
            return _users["default"].findById({
              _id: req.user.id
            });

          case 7:
            user = _context.sent;
            article_title = "";
            data.forEach(function (block) {
              switch (block.type) {
                case "header":
                  console.log(block.data.level);

                  if (block.data.level == 1) {
                    article_title = block.data.text;
                  }

                  break;
              }
            });

            if (!(article_title == "")) {
              _context.next = 17;
              break;
            }

            req.flash("success_msg", "You have to create the title!");

            if (!(user.roleId == "user")) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("return", res.redirect("/user/all-posts"));

          case 16:
            return _context.abrupt("return", res.redirect("/admin/all-posts"));

          case 17:
            _context.next = 19;
            return _articles["default"].find({
              title: article_title
            });

          case 19:
            search = _context.sent;
            real = search !== "" ? article_title.trim().toLowerCase().split("?").join("").split("(").join("").split(")").join("").split(" ").join("-").split("&nbsp;").join("").trim().replace(new RegExp("/", "g"), "-") + "-" + search.length : article_title.trim().toLowerCase().split("?").join("").split("(").join("").split(")").join("").split(" ").join("-").split("&nbsp;").join("").trim().replace(new RegExp("/", "g"), "-");
            array = real.split('');
            array.forEach(function (element, index) {
              if (element == "ß") {
                array[index] = "ss";
              }

              if (element == "ö") {
                array[index] = "oe";
              }

              if (element == "ä") {
                array[index] = "ae";
              }

              if (element == "ü") {
                array[index] = "ue";
              }
            });
            articleslug = array.join("");
            meta_title = "";
            meta_description = "";

            if (req.user.roleId == "admin") {
              _real = search !== "" ? req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") + "-" + search.length : req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-");
              _array = _real.split('');

              _array.forEach(function (element, index) {
                if (element == "ß") {
                  _array[index] = "ss";
                }

                if (element == "ö") {
                  _array[index] = "oe";
                }

                if (element == "ä") {
                  _array[index] = "ae";
                }

                if (element == "ü") {
                  _array[index] = "ue";
                }
              });

              _articleslug = _array.join("");
              articleslug = req.body.slug ? _articleslug : articleslug;
              meta_description = req.body.meta_description;
              meta_title = req.body.meta_title;
            } // let content = req.body.body;
            // let textLength = content.split(/\s/g).length;


            _context.next = 29;
            return _settings["default"].findOne();

          case 29:
            set = _context.sent;

            Date.prototype.getWeek = function () {
              var dt = new Date(this.getFullYear(), 0, 1);
              return Math.ceil(((this - dt) / 86400000 + dt.getDay() + 1) / 7);
            };

            newDate = new Date(); //List months cos js months starts from zero to 11

            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            parse = edjsParser.parse(receive);
            html = "";
            parse.forEach(function (element) {
              html = html + element;
            });
            result = changeTohtml(JSON.stringify(data));
            payload1 = {
              addToNoIndex: noindex,
              articleTablecontent: result.table_content,
              articleBody: result.article,
              week: "".concat(newDate.getWeek()),
              month: "".concat(months[newDate.getMonth()]),
              year: "".concat(newDate.getFullYear()),
              title: article_title.replace(/&nbsp;/gi, ''),
              body: JSON.stringify(data),
              summary: req.body.summary.trim(),
              "short": _htmlToText["default"].fromString(html, {
                wordwrap: false
              }),
              slug: articleslug,
              category: req.body.category,
              file: header_url,
              postedBy: req.user.id,
              postType: "post",
              metatitle: meta_title,
              metadescription: meta_description
            };

            if (req.body.saveflag == "true") {
              payload1.active = false;
            } else {
              payload1.active = true;
            }

            _context.next = 41;
            return _articles["default"].create(payload1);

          case 41:
            createdArticle = _context.sent;
            req.flash("success_msg", "New article has been posted successfully");

            if (!(user.roleId == "user")) {
              _context.next = 47;
              break;
            }

            return _context.abrupt("return", res.redirect("/user/all-posts"));

          case 47:
            return _context.abrupt("return", res.redirect("/dashboard/all-posts"));

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Edit an Article

router.post("/article/edit", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var receive, data, user, article_title, search, articelslug, meta_title, meta_description, _articleslug, parse, html, body, _short, date, article, article_header, active_flag, result;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            receive = JSON.parse(req.body.data);
            data = receive.blocks;
            _context2.next = 5;
            return _users["default"].findById({
              _id: req.user.id
            });

          case 5:
            user = _context2.sent;
            data.forEach(function (block) {
              switch (block.type) {
                case "header":
                  if (block.data.level == 1) {
                    article_title = block.data.text;
                  }

                  break;
              }
            });
            _context2.next = 9;
            return _articles["default"].find({
              title: article_title
            });

          case 9:
            search = _context2.sent;
            // let slug = await Article.findOne({ slug: req.body.slug });
            // if (slug) {
            //   req.flash(
            //     "success_msg",
            //     "That slug has been used, pls used another slug or just leave the field empty"
            //   );
            //   console.log('asdfsfd');
            //   return res.redirect("back");
            // }
            articelslug = req.body.article_slug; // let content = req.body.body;
            // let textLength = content.split(/\s/g).length;
            // if (textLength < 200) {
            //   req.flash(
            //     "success_msg",
            //     "Das sieht doch garnicht mal so schlecht aus! Dennoch solltest du mindestens 200 Wörter schreiben, um deinen Lesern einen Mehrwert zu bieten"
            //   );
            //   return res.redirect("back");
            // }

            meta_title = "";
            meta_description = "";

            if (req.user.roleId == "admin") {
              _articleslug = req.body.article_slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-");
              articelslug = req.body.slug ? articelslug : _articleslug;
              meta_description = req.body.meta_description;
              meta_title = req.body.meta_title;
            }

            parse = edjsParser.parse(receive);
            html = "";
            parse.forEach(function (element) {
              html = html + element;
            });
            body = JSON.stringify(data);
            _short = _htmlToText["default"].fromString(html, {
              wordwrap: false
            }); // if (req.user.roleId == "admin") {
            //   req.body.active = !req.body.status
            //     ? true
            //     : req.body.status == "activate"
            //       ? true
            //       : false;
            // } else {
            //   // req.body.active = set.approveUpdatedUserPost == false ? false : true;
            //   req.body.active = true;
            // }

            date = new Date();
            _context2.next = 22;
            return _articles["default"].findOne({
              _id: req.body.articleId
            });

          case 22:
            article = _context2.sent;
            article_header = req.body.article_header ? createMedia(req.body.article_header) : article.file;
            active_flag = false;

            if (req.body.saveflag == "true") {
              active_flag = false;
            } else {
              active_flag = true;
            }

            result = changeTohtml(JSON.stringify(data));

            _articles["default"].updateOne({
              _id: req.body.articleId.trim()
            }, {
              $set: {
                title: article_title.replace(/&nbsp;/gi, ''),
                slug: articelslug,
                "short": _short,
                body: body,
                updatedAt: date,
                category: req.body.category,
                summary: req.body.summary,
                file: article_header,
                metatitle: meta_title,
                metadescription: meta_description,
                active: active_flag,
                articleTablecontent: result.table_content,
                articleBody: result.article,
                addToNoIndex: req.body.articlenoindex
              }
            }).then(function (updated) {
              req.flash("success_msg", "Article has been updated successfully");

              if (req.user.roleId == "admin") {
                return res.redirect('/dashboard/all-posts/');
              } else {
                return res.redirect('/user/all-posts/');
              }
            })["catch"](function (e) {
              return next(e);
            });

            _context2.next = 33;
            break;

          case 30:
            _context2.prev = 30;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 30]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Delete an Article

router.post("/article/delete", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var article;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _articles["default"].findById(req.body.articleId);

          case 3:
            article = _context3.sent;

            _comment["default"].deleteMany({
              slug: article.slug
            }).then(function (deleted) {
              _articles["default"].deleteOne({
                _id: req.body.articleId.trim()
              }).then(function (deleted) {
                req.flash("success_msg", "Article has been Deleted");
              })["catch"](function (e) {
                return next(e);
              });
            })["catch"](function (e) {
              return next(e);
            });

            _comment["default"].deleteMany({});

            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()); // Delete Many Articles

router.post("/article/deletemany", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _comment["default"].deleteMany({
              articleId: req.body.ids
            });

          case 3:
            _context4.next = 5;
            return _articles["default"].deleteMany({
              _id: req.body.ids
            });

          case 5:
            if (req.body.ids) {
              _context4.next = 10;
              break;
            }

            req.flash("success_msg", "Nothing Has Been Deleted");
            return _context4.abrupt("return", res.redirect('back'));

          case 10:
            req.flash("success_msg", "Posts Has Been Deleted");
            return _context4.abrupt("return", res.redirect('back'));

          case 12:
            _context4.next = 17;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 14]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // Activate Many Articles

router.post("/article/activateMany", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Has Been Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Published");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Deactivate Many Articles

router.post("/article/deactivateMany", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    f;

    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: false
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Has Been Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Saved to Draft");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});

function changeTohtml(data) {
  var _data = JSON.parse(data);

  var idList = [];
  var body_content_element = "";

  _data.forEach(function (element, index) {
    var _template = "";

    switch (element.type) {
      case "header":
        if (element.data.level == 2) {
          idList.push(index); // _template = '<h' + element.data.level + ' id="' + index + '">' + element.data.text + '</h' + element.data.level + '>';
        }

        _template = '<h' + element.data.level + ' id="' + index + '">' + element.data.text + '</h' + element.data.level + '>';
        break;

      case "paragraph":
        _template = '<p style="margin-top:30px" id="' + index + '">' + element.data.text + '</p>';
        break;

      case "image":
        _template = '<img id="' + index + '" src=' + element.data.url + ' alt=' + element.data.caption + '/>';
        break;

      case "code":
        var code = element.data.code;
        code = code.replace(/</g, "&lt;");
        code = code.replace(/>/g, "&gt;");
        console.log(code);
        _template = '<pre id="' + index + '">' + code + '</pre>';
        break;

      case "embed":
        _template = '<div id="' + index + '" class="text-center" style="margin-top:10px;"><iframe src="' + element.data.embed + '" width="' + element.data.width + '" height="' + element.data.height + '" frameborder="0" allowfullscreen></iframe></div>';
        break;

      case "table":
        var content = element.data.content;
        _template = '<table id="' + index + '" class="table table-bordered table-hover" style="width:85%;margin: auto;margin-bottom: 10px;">';
        content.forEach(function (element, index) {
          var length = element.length;
          var tr_template = "<tr class='text-center'>";

          for (var i = 0; i < length; i++) {
            var td_template = '<td>';
            td_template = td_template + element[i] + '</td>';
            tr_template += td_template;
          }

          tr_template += '</tr>';
          _template += tr_template;
        });
        _template = _template + "</table>";
        break;

      case "quote":
        _template = '<blockquote id="' + index + '"><p class="quotation-mark">“' + element.data.text + '“</p><h3 class="text-right">--- ' + element.data.caption + ' ---</h3></blockquote>';
        break;

      case "list":
        var type = element.data.style.charAt(0);
        _template = '<div id="' + index + '"><' + type + 'l>';
        element.data.items.forEach(function (item) {
          _template += '<li>' + item + '</li>';
        });
        _template += '</' + type + 'l></div>';
        break;
    }

    body_content_element = body_content_element + _template;
  });

  var table_content_element = '<ol class="table-content table-contents"><h2 class="table-content-title">Inhalt</h2>';
  var table_element = [];

  _data.forEach(function (element) {
    if (element.type == "header") {
      if (element.data.level == 2) {
        table_element.push(element);
      }
    }
  });

  var _string = "";
  table_element.forEach(function (item, index) {
    var template = '<li><a href="#' + idList[index] + '"><p class="table-content-paragraph">' + item.data.text + '</p></a></li>';
    _string = _string + template;
  });
  table_content_element = table_content_element + _string + '</ol>';
  var returnData = {
    article: body_content_element,
    table_content: table_content_element
  };
  return returnData;
}

router.get("/p/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var __articles, settings, user, slug, article, bookmark, book, art, category, _length, r, related, nextprev, ips, sameArticle, articleCount, indexof, view_article, comments, _articleBody, saveText, _res, ip, payload, _view_article, _comments, _articleBody2, _saveText;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _articles["default"].find({});

          case 2:
            __articles = _context6.sent;

            __articles.forEach( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(article) {
                var data, _res;

                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        data = article.body;
                        _res = changeTohtml(data);
                        _context5.next = 4;
                        return _articles["default"].updateOne({
                          _id: article._id
                        }, {
                          $set: {
                            articleTablecontent: _res.table_content,
                            articleBody: _res.article
                          }
                        });

                      case 4:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x16) {
                return _ref6.apply(this, arguments);
              };
            }());

            _context6.next = 6;
            return _settings["default"].findOne();

          case 6:
            settings = _context6.sent;
            user = req.params.user;
            slug = req.params.slug;
            _context6.next = 11;
            return _articles["default"].find({
              slug: slug
            });

          case 11:
            article = _context6.sent;

            if (!(article == "" && article.active == false)) {
              _context6.next = 16;
              break;
            }

            res.render("404");
            _context6.next = 85;
            break;

          case 16:
            if (!(typeof req.user !== "undefined")) {
              _context6.next = 22;
              break;
            }

            _context6.next = 19;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 19:
            _context6.t0 = _context6.sent;
            _context6.next = 23;
            break;

          case 22:
            _context6.t0 = false;

          case 23:
            bookmark = _context6.t0;
            book = bookmark ? true : false;
            _context6.next = 27;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 27:
            art = _context6.sent;
            _context6.next = 30;
            return _category["default"].findOne({
              slug: req.params.category
            });

          case 30:
            category = _context6.sent;
            _context6.next = 33;
            return _articles["default"].find({
              active: true,
              category: category._id
            });

          case 33:
            _length = _context6.sent;
            r = Math.floor(Math.random() * _length.length);
            _context6.next = 37;
            return _articles["default"].find({
              active: true,
              category: category._id
            }).populate("postedBy").populate("category").limit(3).skip(r).sort({
              createdAt: -1
            });

          case 37:
            related = _context6.sent;
            _context6.next = 40;
            return _articles["default"].find({
              active: true,
              category: category._id
            }).populate("postedBy").populate("category").limit(2).skip(r);

          case 40:
            nextprev = _context6.sent;
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context6.next = 44;
            return _articles["default"].find({
              active: true,
              category: category._id
            }).populate("category").populate("postedBy");

          case 44:
            sameArticle = _context6.sent;
            articleCount = sameArticle.length;
            indexof = -1;
            art.viewers.forEach(function (element) {
              if (element.ip == ips) {
                indexof = 1;
              }
            });

            if (!(indexof !== -1)) {
              _context6.next = 64;
              break;
            }

            _context6.next = 51;
            return _articles["default"].findOne({
              slug: req.params.slug.trim()
            }).populate("postedBy").populate('category');

          case 51:
            view_article = _context6.sent;
            _context6.next = 54;
            return _comment["default"].find({
              articleId: view_article._id
            }).sort({
              upvotecount: -1
            });

          case 54:
            comments = _context6.sent;
            // var article_body = view_article.body;
            // var _res = changeTohtml(article_body);
            _articleBody = view_article.articleBody;
            _context6.next = 58;
            return _savetext["default"].find({
              articleId: view_article._id,
              userId: req.user ? req.user.id : null
            });

          case 58:
            saveText = _context6.sent;
            _res = "";

            if (saveText.length > 0) {
              _res = changeTohtml(saveText[0].articleBody);
              _articleBody = _res.article;
            }

            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: view_article,
              article_body: _articleBody,
              // article_table_content: _res.table_content,
              settings: settings,
              previous: nextprev[0],
              next: nextprev[1],
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id,
              comments: comments
            });
            _context6.next = 85;
            break;

          case 64:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            payload = {
              ip: ip,
              date: new Date()
            };
            _context6.next = 68;
            return _users["default"].updateOne({
              _id: art.postedBy
            }, {
              $inc: {
                contentviews: 1
              }
            });

          case 68:
            _context6.next = 70;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: payload
              }
            });

          case 70:
            _context6.next = 72;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            });

          case 72:
            _context6.next = 74;
            return _articles["default"].findOne({
              slug: req.params.slug.trim()
            }).populate("postedBy").populate('category');

          case 74:
            _view_article = _context6.sent;
            _context6.next = 77;
            return _comment["default"].find({
              articleId: _view_article._id
            }).sort({
              upvotecount: -1
            });

          case 77:
            _comments = _context6.sent;
            // var _res = changeTohtml(article_body);
            _articleBody2 = _view_article.articleBody;
            _context6.next = 81;
            return _savetext["default"].find({
              articleId: _view_article._id,
              userId: req.user ? req.user.id : null
            });

          case 81:
            _saveText = _context6.sent;
            _res = "";

            if (_saveText.length > 0) {
              _res = changeTohtml(_saveText[0].articleBody);
              _articleBody2 = _res.article;
            }

            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: _view_article,
              article_body: _articleBody2,
              settings: settings,
              previous: nextprev[0],
              next: nextprev[1],
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id,
              comments: _comments
            });

          case 85:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()); // Get single article page

router.get("/d/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var settings, article, bookmark, book, art, category, _length, r, related, nextprev, d, customDate, ips, sameArticle, articleCount, indexof, article_body, _articleBody, saveText, _res, ip, payload;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context8.sent;
            _context8.next = 6;
            return _articles["default"].aggregate([{
              $match: {
                active: true,
                slug: req.params.slug
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
              }
            }, {
              $unwind: {
                path: "$subCategory",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "comments",
                "let": {
                  indicator_id: "$_id"
                },
                as: "comments",
                pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ["$articleId", "$$indicator_id"]
                    },
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }]
              }
            }]);

          case 6:
            article = _context8.sent;

            if (!(article == "")) {
              _context8.next = 11;
              break;
            }

            res.render("404");
            _context8.next = 61;
            break;

          case 11:
            if (!(typeof req.user !== "undefined")) {
              _context8.next = 17;
              break;
            }

            _context8.next = 14;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 14:
            _context8.t0 = _context8.sent;
            _context8.next = 18;
            break;

          case 17:
            _context8.t0 = false;

          case 18:
            bookmark = _context8.t0;
            book = bookmark ? true : false;
            _context8.next = 22;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 22:
            art = _context8.sent;
            _context8.next = 25;
            return _category["default"].findOne({
              slug: req.params.category
            });

          case 25:
            category = _context8.sent;
            _context8.next = 28;
            return _articles["default"].find({
              active: true,
              category: category._id
            });

          case 28:
            _length = _context8.sent;
            r = Math.floor(Math.random() * _length.length);
            _context8.next = 32;
            return _articles["default"].find({
              active: true,
              category: category._id
            }).populate("postedBy").populate("category").limit(3).skip(r).sort({
              createdAt: -1
            });

          case 32:
            related = _context8.sent;
            _context8.next = 35;
            return _articles["default"].find({
              active: true,
              category: category._id
            }).populate("postedBy").populate("category").limit(2).skip(r);

          case 35:
            nextprev = _context8.sent;
            d = new Date();
            customDate = "".concat(d.getDate(), "/").concat(d.getMonth(), "/").concat(d.getFullYear());
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null); //

            _context8.next = 41;
            return _articles["default"].find({
              active: true,
              category: category._id
            }).populate("category").populate("postedBy");

          case 41:
            sameArticle = _context8.sent;
            articleCount = sameArticle.length;
            indexof = -1;
            art.viewers.forEach(function (element) {
              if (element.ip == ips) {
                indexof = 1;
              }
            });

            if (!(indexof !== -1)) {
              _context8.next = 56;
              break;
            }

            article_body = article[0].body;
            _articleBody = article[0].articleBody;
            _context8.next = 50;
            return _savetext["default"].find({
              articleId: article[0]._id,
              userId: req.user ? req.user.id : null
            });

          case 50:
            saveText = _context8.sent;
            _res = "";

            if (saveText.length > 0) {
              _res = changeTohtml(saveText[0].articleBody);
              _articleBody = _res.article;
            }

            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: article[0],
              settings: settings,
              article_body: _articleBody,
              previous: nextprev[0],
              next: nextprev[1],
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id
            });
            _context8.next = 61;
            break;

          case 56:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            payload = {
              ip: ip,
              date: new Date()
            };
            _context8.next = 60;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: payload
              }
            });

          case 60:
            _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            }).then( /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(views) {
                var _articleBody, saveText, _res;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _articleBody = article[0].articleBody;
                        _context7.next = 3;
                        return _savetext["default"].find({
                          articleId: article[0]._id,
                          userId: req.user ? req.user.id : null
                        });

                      case 3:
                        saveText = _context7.sent;
                        _res = "";

                        if (saveText.length > 0) {
                          _res = changeTohtml(saveText[0].articleBody);
                          _articleBody = _res.article;
                        }

                        res.render("single", {
                          articleCount: articleCount,
                          title: article[0].title,
                          article: article[0],
                          article_body: _articleBody,
                          previous: nextprev[0],
                          next: nextprev[1],
                          settings: settings,
                          related: related,
                          bookmark: book,
                          bookmarkId: bookmark == null ? null : bookmark._id
                        });

                      case 7:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x20) {
                return _ref8.apply(this, arguments);
              };
            }())["catch"](function (err) {
              return next(err);
            });

          case 61:
            _context8.next = 66;
            break;

          case 63:
            _context8.prev = 63;
            _context8.t1 = _context8["catch"](0);
            next(_context8.t1);

          case 66:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 63]]);
  }));

  return function (_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}()); // Get article based on a category

router.get("/all-post", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var perPage, page;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            perPage = 7;
            page = req.query.page || 1;
            _context10.prev = 2;
            _context10.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            }).then( /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(category) {
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        if (category) {
                          _context9.next = 4;
                          break;
                        }

                        res.status(404).render("404");
                        _context9.next = 6;
                        break;

                      case 4:
                        _context9.next = 6;
                        return _articles["default"].find({
                          category: category._id
                        }).populate("postedBy").sort({
                          createdAt: -1
                        }).skip(perPage * page - perPage).limit(perPage).exec(function (err, post) {
                          _articles["default"].countDocuments({
                            category: category._id
                          }).exec(function (err, count) {
                            if (err) return next(err);
                            res.render("category", {
                              post: post,
                              current: page,
                              pages: Math.ceil(count / perPage),
                              cat: req.query.category
                            });
                          });
                        });

                      case 6:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x24) {
                return _ref10.apply(this, arguments);
              };
            }())["catch"](function (e) {
              return next(e);
            });

          case 5:
            _context10.next = 10;
            break;

          case 7:
            _context10.prev = 7;
            _context10.t0 = _context10["catch"](2);
            next(_context10.t0);

          case 10:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[2, 7]]);
  }));

  return function (_x21, _x22, _x23) {
    return _ref9.apply(this, arguments);
  };
}());
router.post('/api/kategorie', /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var slug, category, articles;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            slug = req.body.slug;
            _context11.next = 3;
            return _category["default"].findOne({
              slug: slug
            });

          case 3:
            category = _context11.sent;
            _context11.next = 6;
            return _articles["default"].find({
              category: category.id
            }).sort({
              createdAt: -1
            }).limit(10);

          case 6:
            articles = _context11.sent;
            return _context11.abrupt("return", res.json({
              "data": articles
            }));

          case 8:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x25, _x26, _x27) {
    return _ref11.apply(this, arguments);
  };
}()); // Get all the posts in a category

router.post('/kategory-ajax', /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var page, slug, cat, articles, length, totalsize, r, return_article;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            page = req.body.page;
            slug = req.body.slug;
            _context12.next = 4;
            return _category["default"].findOne({
              slug: slug
            });

          case 4:
            cat = _context12.sent;
            _context12.next = 7;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").sort({
              createdAt: -1
            });

          case 7:
            articles = _context12.sent;
            length = articles.length;
            totalsize = Math.floor(length / 6) + 1;
            r = 6 * page;
            _context12.next = 13;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").sort({
              createdAt: -1
            }).limit(6).skip(r);

          case 13:
            return_article = _context12.sent;
            return _context12.abrupt("return", res.json({
              'data': return_article,
              'page': page,
              'total': totalsize
            }));

          case 15:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x28, _x29, _x30) {
    return _ref12.apply(this, arguments);
  };
}());
router.get("/kategorie/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var perPage, page, cat, post, count, featured;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            perPage = 6;
            page = req.query.page || 1;
            _context13.next = 5;
            return _category["default"].findOne({
              slug: req.params.slug
            });

          case 5:
            cat = _context13.sent;

            if (cat) {
              _context13.next = 10;
              break;
            }

            res.render("404");
            _context13.next = 20;
            break;

          case 10:
            _context13.next = 12;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").populate("subCategory").skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 12:
            post = _context13.sent;
            _context13.next = 15;
            return _articles["default"].countDocuments({
              active: true,
              category: cat._id
            });

          case 15:
            count = _context13.sent;
            _context13.next = 18;
            return _articles["default"].find({
              active: true,
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 18:
            featured = _context13.sent;
            res.render("category", {
              title: cat.name,
              cat: cat.name,
              background: cat.background,
              category: cat,
              post: post,
              current: page,
              pages: Math.ceil(count / perPage),
              featured: featured
            });

          case 20:
            _context13.next = 25;
            break;

          case 22:
            _context13.prev = 22;
            _context13.t0 = _context13["catch"](0);
            next(_context13.t0);

          case 25:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 22]]);
  }));

  return function (_x31, _x32, _x33) {
    return _ref13.apply(this, arguments);
  };
}()); // Add to slider

router.post("/article/add-to-slider", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        showPostOnSlider: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to recommended

router.post("/article/add-to-recommended", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToRecommended: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to featured

router.post("/article/add-to-featured", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToFeatured: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to breaking

router.post("/article/add-to-breaking", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToBreaking: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Upvote a post

router.post("/article/upvote", _auth["default"], /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt("return", res.redirect("back"));

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x34, _x35, _x36) {
    return _ref14.apply(this, arguments);
  };
}());
router.post('/article/upvote-ajax', /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var date, articleId, userId, payload, article_origin, indexof, article, upvotecount, result;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            date = new Date();
            articleId = req.body.articleId;
            userId = req.body.userId;
            payload = {
              date: date,
              user: req.user.id
            };
            _context15.next = 6;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 6:
            article_origin = _context15.sent;
            indexof = -1;
            article_origin.upvote.users.forEach(function (element) {
              if (element.user == req.user.id) {
                indexof = 1;
              }
            });

            if (!(indexof == -1 && articleId != userId)) {
              _context15.next = 12;
              break;
            }

            _context15.next = 12;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $push: {
                "upvote.users": payload
              },
              $inc: {
                "upvote.count": 1
              }
            });

          case 12:
            _context15.next = 14;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 14:
            article = _context15.sent;
            upvotecount = article.upvote.count;
            result = {
              upvotecount: upvotecount,
              success: true
            };
            res.json(result);

          case 18:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x37, _x38, _x39) {
    return _ref15.apply(this, arguments);
  };
}()); // Downvote a post

router.post("/article/downvote", _auth["default"], /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $push: {
                "update.users": req.user.id
              },
              $inc: {
                "upvote.count": -1
              }
            });

          case 2:
            res.status(200).send("Post Has been Downvoted");

          case 3:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x40, _x41, _x42) {
    return _ref16.apply(this, arguments);
  };
}()); // Flag an article

router.post("/article/flag", /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return _flag["default"].create({
              articleId: req.body.articleId,
              reason: req.body.reason.trim(),
              userId: req.user.id != undefined ? req.user.id : undefined
            });

          case 2:
            res.status(200).send("Post has been flagged, Admin will look into it anytime soon.");

          case 3:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x43, _x44, _x45) {
    return _ref17.apply(this, arguments);
  };
}()); // Clap under an article

router.post("/article/clap", /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res, next) {
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $inc: {
                claps: 1
              }
            });

          case 2:
            res.status(200).send("Clapped under post");

          case 3:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x46, _x47, _x48) {
    return _ref18.apply(this, arguments);
  };
}());
module.exports = router;