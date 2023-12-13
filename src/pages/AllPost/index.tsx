import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import pic from "../../assets/Ellipse 253.svg";

type Post = {
  id: number;
  name: string;
  title: string;
  category: string;
  description: string;
  file_url: string;
  link_external: string;
  seen: number;
  like: boolean;
  is_my_km: boolean;
  date: string;
  profile_pict: string;
};

interface Category {
  id: number;
  title: string;
}

interface Form {
  title?: any;
  description?: any;
  link_external?: any;
}

const AllPost = () => {
  const navigate = useNavigate();
  const [dataPost, setDataPost] = useState<Post[]>([]);
  const [dataProfile, setDataProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(2);
  const [search, setSearch] = useState<any>();
  const [filter, setFilter] = useState<any>([]);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [category, setCategory] = useState<any>();
  const [myPoin, setMyPoin] = useState<number>();
  const [idKm, setIdKm] = useState<number>();
  const [fileOrLink, setFileOrLink] = useState<string>();
  const [notes, setNotes] = useState<string>();
  const [file, setFile] = useState<any>();
  const [report, setReport] = useState<any>();
  const [dataCategory, setDataCategory] = useState<Category[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const token: any = localStorage.getItem("token");
  const tokenParams: any = searchParams.get("token");
  const filterString = filter.toString();

  const getData = (
    pageSize: number,
    pageIndex: number,
    searchIndex: string,
    filterCategory: any
  ) => {
    axios
      .get(
        `${process.env.REACT_APP_URL}qubisa/km/participant/timeline/${
          pageSize ?? 10
        }/${pageIndex ?? 1}`,
        {
          headers: {
            Authorization: `Bearer ${
              tokenParams === null ? token : tokenParams
            }`,
          },
          params: {
            search: searchIndex ?? search,
            filter_category: filterCategory,
          },
        }
      )
      .then((res) => {
        setDataPost(res.data.data);
        setLoading(false);
      });
  };

  const handleChangeCheckbox = (e: any) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilter([...filter, value]);
    } else {
      setFilter(filter.filter((e: any) => e !== value));
    }
  };

  const fetchMoreData = () => {
    axios
      .get(
        `${process.env.REACT_APP_URL}qubisa/km/participant/timeline/10/${index}`,
        {
          headers: {
            Authorization: `Bearer ${
              tokenParams === null ? token : tokenParams
            }`,
          },
          params: {
            search: search,
            filter_category: filterString === "" ? 0 : filterString,
          },
        }
      )
      .then((res) => {
        setDataPost((prevItems) => [...prevItems, ...res.data.data]);

        res.data.data.length > 0 ? setHasMore(true) : setHasMore(false);
      })
      .catch((err) => console.log(err));

    setIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    if (tokenParams) {
      localStorage.setItem("token", tokenParams);
    }
    getData(10, 1, "", 0);
    axios
      .get(`${process.env.REACT_APP_URL}qubisa/km/participant/decode`, {
        headers: {
          Authorization:
            "Basic " +
            btoa(
              `${process.env.REACT_APP_USERNAME}:${process.env.REACT_APP_PASSWORD}`
            ),
        },
        params: { token: tokenParams === null ? token : tokenParams },
      })
      .then((res) => {
        setDataProfile(res.data.data);
      });

    axios
      .get(`${process.env.REACT_APP_URL}qubisa/km/participant/category`, {
        headers: {
          Authorization: `Bearer ${tokenParams === null ? token : tokenParams}`,
        },
      })
      .then((res) => {
        setDataCategory(res.data.data);
      });
    axios
      .get(`${process.env.REACT_APP_URL}qubisa/km/participant/my_point`, {
        headers: {
          Authorization: `Bearer ${tokenParams === null ? token : tokenParams}`,
        },
      })
      .then((res) => {
        setMyPoin(res.data.point);
      });
  }, []);

  const handleLike = (idKm: number) => {
    axios
      .post(
        `${process.env.REACT_APP_URL}qubisa/km/participant/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              tokenParams === null ? token : tokenParams
            }`,
          },
          params: { id_km: idKm },
        }
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleUnlike = (idKm: number) => {
    axios
      .post(
        `${process.env.REACT_APP_URL}qubisa/km/participant/unlike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              tokenParams === null ? token : tokenParams
            }`,
          },
          params: { id_km: idKm },
        }
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const PPData = new FormData();
    PPData.append("file", file ? file : "");
    PPData.append("title", form?.title);
    PPData.append("description", form?.description);
    PPData.append(
      "link_external",
      form?.link_external ? form?.link_external : ""
    );
    PPData.append("id_category", category);
    await axios
      .post(
        `${process.env.REACT_APP_URL}qubisa/km/participant/create`,
        PPData,
        {
          headers: {
            Authorization: `Bearer ${
              tokenParams === null ? token : tokenParams
            }`,
          },
        }
      )
      .then((res) => {
        toast.success("Created Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleReport = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}qubisa/km/participant/timeline/report_content`,
        { id_km: idKm, notes: report },
        {
          headers: {
            Authorization: `Bearer ${
              tokenParams === null ? token : tokenParams
            }`,
          },
        }
      )
      .then((res) => {
        toast.success("Reported Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="pt-5 overscroll-none no-scrollbar">
      <div className="px-4 flex">
        {/* <i
          className="fa-solid fa-chevron-left text-xl me-4 cursor-pointer"
          onClick={() => navigate(-1)}
        ></i> */}
        <p className="my-auto text-xl font-bold">MKM</p>
      </div>
      <div className="flex justify-between px-4 mt-6">
        <input
          type="text"
          className="bg-transperancy-50 text-sm rounded-xl p-2.5 w-full me-3"
          placeholder="Search Knowledge Here"
          onChange={(e) => {
            getData(10, 1, e.target.value, filterString === "" ? 0 : filterString);
            setSearch(e.target.value);
          }}
        ></input>
        <button
          className="button btn bg-primary rounded-xl p-1.5 w-28"
          onClick={() => setShowCreate(true)}
        >
          + Create
        </button>
      </div>
      <div className="grid grid-flow-col justify-stretch mt-5 text-sm text-center">
        <p
          className="hover:border-b-2 border-error p-3 cursor-pointer border-b-2"
          onClick={() => navigate("/")}
        >
          All Post
        </p>
        <p
          className="hover:border-b-2 border-error p-3 cursor-pointer"
          onClick={() => navigate("/my-poin")}
        >
          My Poin ({myPoin})
        </p>
        <p
          className="hover:border-b-2 border-error p-3 cursor-pointer"
          onClick={() => navigate("/history")}
        >
          History
        </p>
        <i
          className="fa-solid fa-filter text-white p-2 text-base cursor-pointer"
          onClick={() => setShowFilter(true)}
        ></i>
      </div>

      <div>
        {loading === true ? (
          <svg
            aria-hidden="true"
            className="w-8 h-8 mt-10 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        ) : (
          <InfiniteScroll
            dataLength={dataPost.length}
            next={fetchMoreData}
            hasMore={hasMore}
            height="100vh"
            loader={<p className="text-center my-4">Loading...</p>}
            endMessage={
              <p className="text-center my-4">No more data to load.</p>
            }
            className="no-scrollbar"
          >
            <div>
              {dataPost.map((item) => (
                <div className="mx-4 mt-5 flex">
                  <img
                    className="mb-auto me-2 object-none w-12 h-12 rounded-full"
                    src={item.profile_pict === null ? pic : item.profile_pict}
                    width={58}
                  />
                  <div className="bg-transperancy-50 rounded-xl w-full">
                    <div className="flex justify-between text-sm bg-transperancy-100 p-2 px-4 rounded-t-xl">
                      <p className="me-4 text-[10px]">
                        {item.name} - {item.date}
                      </p>
                      <p className="text-[10px]">dilihat {item.seen} kali</p>
                    </div>
                    <div className="p-3.5">
                      <p className="text-sm">{item.title}</p>
                      <p className="text-[10px] mt-1">{item.category}</p>
                      {item.link_external !== null && (
                        <div className="my-2.5">
                          <i className="fa-solid fa-link text-[12px] me-2"></i>
                          <a
                            href={item.link_external}
                            className="text-[10px] underline"
                          >
                            {item.link_external.length > 40
                              ? `${item.link_external.substring(0, 40)}...`
                              : item.link_external}
                          </a>
                        </div>
                      )}
                      {item.file_url !== null && (
                        <div className="flex my-3">
                          <a href={item.file_url}>
                            <i className="fa-solid fa-file-lines me-2 cursor-pointer text-purple-600"></i>
                          </a>
                          <span className="text-[10px] my-auto">
                            {item.file_url.length > 40
                              ? `${item.file_url.substring(0, 40)}...`
                              : item.file_url}
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] mt-3">{item.description}</p>
                      {item.is_my_km === false && (
                        <div className="flex mt-3">
                          {item.like === true ? (
                            <i
                              className="fa-solid fa-thumbs-up text-primary me-2 cursor-pointer"
                              onClick={() => handleUnlike(item.id)}
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-thumbs-up text-white me-2 cursor-pointer"
                              onClick={() => handleLike(item.id)}
                            ></i>
                          )}
                          <span className="text-[10px] me-5 my-auto">
                            Sukai
                          </span>
                          <i
                            className="fa-solid fa-circle-info text-white me-2 cursor-pointer"
                            onClick={() => {
                              setShowReport(true);
                              setIdKm(item.id);
                            }}
                          ></i>
                          <span className="text-[10px] my-auto">Laporkan</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>

      {/* modal */}
      {showFilter && (
        <>
          <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full">
              <div className="bg-transperancy-50 border-0 rounded-t-xl relative flex flex-col w-full outline-none focus:outline-none">
                <button
                  className="p-2 ml-auto border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowFilter(false)}
                >
                  <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
                <p className="text-xl font-bold text-center mb-3">Kategori</p>
                {dataCategory.map((item) => (
                  <div className="border-b p-6 flex justify-between">
                    <p>{item.title}</p>
                    <input
                      type="checkbox"
                      value={item.id}
                      className="w-4 h-4 bg-gray-100"
                      onChange={handleChangeCheckbox}
                    />
                  </div>
                ))}
                <div
                  className="btn button bg-primary rounded p-2.5 mt-6 m-4 text-center cursor-pointer"
                  onClick={() => {
                    getData(10, 1, search, filterString);
                    setShowFilter(false);
                  }}
                >
                  Submit
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showCreate && (
        <>
          <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full">
              <div className="bg-transperancy-50 border-0 rounded-t-xl relative flex flex-col w-full outline-none focus:outline-none">
                <button
                  className="p-2 ml-auto border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowCreate(false)}
                >
                  <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
                <p className="text-xl font-bold text-center mb-3">Create MKM</p>
                <form className="p-4 gap-4 grid">
                  <input
                    type="text"
                    placeholder="Title*"
                    name="title"
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    onChange={handleChange}
                  />
                  <select
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    name="category"
                    onChange={(e) => setCategory(Number(e.target.value))}
                  >
                    <option>Category*</option>
                    {dataCategory.map((item) => (
                      <option value={item.id}>{item.title}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Deskripsi*"
                    name="description"
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    onChange={handleChange}
                  />
                  <select
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    onChange={(e) => setFileOrLink(e.target.value)}
                  >
                    <option>Pilih*</option>
                    <option value="file">File</option>
                    <option value="link">Link</option>
                  </select>
                  {fileOrLink === "file" && (
                    <input
                      type="file"
                      placeholder="Category*"
                      className="bg-black border text-white text-sm rounded w-full p-2.5"
                      accept=".jpg, .png, .mp4, .mp3"
                      onChange={handleChangeFile}
                    />
                  )}
                  {fileOrLink === "link" && (
                    <input
                      type="text"
                      placeholder="Link*"
                      name="link_external"
                      className="bg-black border text-white text-sm rounded w-full p-2.5"
                      onChange={handleChange}
                    />
                  )}
                  <div
                    className="btn button bg-primary rounded p-2.5 mt-5 text-center cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Submit
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showReport && (
        <>
          <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full">
              <div className="bg-transperancy-50 border-0 rounded-t-xl relative flex flex-col w-full outline-none focus:outline-none">
                <button
                  className="p-2 ml-auto border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowReport(false)}
                >
                  <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
                <p className="text-xl font-bold text-center mb-3">Laporkan</p>
                {["Spam", "Konten Kekerasan"].map((item) => (
                  <div className="border-b p-6 flex justify-between">
                    <p>{item}</p>
                    <input
                      checked={report === item}
                      type="radio"
                      className="w-4 h-4 bg-gray-100"
                      value={item}
                      onChange={(e) => setReport(e.target.value)}
                    />
                  </div>
                ))}
                <button
                  className="btn button bg-primary rounded p-2.5 m-4 mt-6"
                  onClick={handleReport}
                >
                  Laporkan
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
};

export default AllPost;
