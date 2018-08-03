using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AngleSharp.Parser.Html;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Welfare.Controllers
{
    [Route("api/[controller]/[action]")]
    public class WelfareController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public async Task<List<WelfareInfo>> GetAll(int page)
        {
             
            using (HttpClient http = new HttpClient())
            {
                var htmlString = await http.GetStringAsync("http://fuliba.net/page/"+page+"");
                HtmlParser htmlParser = new HtmlParser();
                var jobInfos = htmlParser.Parse(htmlString)
                .QuerySelectorAll("article")
                .Select(t => new WelfareInfo()
                {
                    Title = t.QuerySelectorAll("h2").FirstOrDefault().TextContent,
                    Content = t.QuerySelectorAll(".note").FirstOrDefault().TextContent,
                    Date = t.QuerySelectorAll(".meta time").FirstOrDefault().TextContent,
                    DetailsUrl = t.QuerySelectorAll("a").FirstOrDefault().Attributes.FirstOrDefault(f => f.Name == "href").Value,
                    Image = t.QuerySelectorAll(".focus img").FirstOrDefault().Attributes.FirstOrDefault(f => f.Name == "data-src").Value,
                    Pinglun = t.QuerySelectorAll(".meta a").Length == 1 ? "" : t.QuerySelectorAll(".meta a").FirstOrDefault().TextContent,
                    Zan = t.QuerySelectorAll(".meta a span").FirstOrDefault().TextContent
                })
                .ToList();
                return jobInfos;
            }
        }
        public class WelfareInfo
        {

            /// <summary>
            /// 标题
            /// </summary>
            public string Title { get; set; }
            /// <summary>
            /// 内容
            /// </summary>
            public string Content { get; set; }
            /// <summary>
            /// 日期
            /// </summary>
            public string Date { get; set; }
            /// <summary>
            /// 评论
            /// </summary>
            public string Pinglun { get; set; }
            /// <summary>
            /// 赞
            /// </summary>
            public string Zan { get; set; }
            /// <summary>
            /// 图片
            /// </summary>
            public string Image { get; set; }
            /// <summary>
            /// 详情url
            /// </summary>
            public string DetailsUrl { get; set; }
        }
    }
}