const About = () => {
 const teamMembers = [
  {
   img: "",
   name: "Egesa Raymond",
   role: ""
  },
  {
   img: "",
   name: "Mwesigwa Trevor",
   role: ""
  }
 ];

 const blogs = [
  {
   id: Math.floor(Math.random() * 1000 + 1),
   blog_Img: "",
   topics: ["Design", "Technology", "Presentations"],
   timePosted: "Mar 10, 2024",
   user: {
    name: "Lindsy Walton",
    image: "L"
   },
   title: "Libero quisquam volunpata tisus namo."
  },
  {
   id: Math.floor(Math.random() * 1000 + 1),
   blog_Img: "",
   topics: ["Design", "Documentations", "Presentations"],
   timePosted: "Jun 15, 2024",
   user: {
    name: "Bella Anderson",
    image: "B"
   },
   title: "Libero quisquam volunpata tisus namo."
  },
  {
   id: Math.floor(Math.random() * 1000 + 1),
   blog_Img: "",
   topics: ["Technology", "Presentations"],
   timePosted: "Nov 10, 2024",
   user: {
    name: "William Waters",
    image: "W"
   },
   title: "Libero quisquam volunpata tisus namo."
  }
 ];

 return (
  <div className="bg-white text-black dark:bg-slate-900 dark:text-white">
   <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
    <div
     aria-hidden="true"
     className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
    >
     <div
      style={{
       clipPath:
        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.7%, 76.1% 97.7%, 74.1% 44.1%)"
      }}
      className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-60"
     />
    </div>
    <div className="mx-auto max-w-4xl text-center">
     <h2 className="text-base/7 font-semibold text-green-600 dark:text-green-400">
      About
     </h2>
     <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-left text-gray-900 sm:text-6xl dark:text-zinc-100">
      We're changing the way people make school reports
     </p>
    </div>
    <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-lg font-medium text-gray-600 sm:text-xl/8 dark:text-gray-300 dark:text-zinc-300">
     KCB reports is a reporting system that strives in changing and easing
     report making and student's academic progress analysis for teachers,
     parents and school administrators.
    </p>
   </div>
   <div className="w-full h-[120vh] mt-14">
    <div className="h-full w-full relative overflow-hidden">
     {/* Card Image 1*/}
     <div className="h-[17.5rem] w-[12rem] rounded-2xl absolute top-6 -left-1/2 translate-x-1/2 shadow bg-amber-100">
      Card 1
     </div>
     {/* Card Image 2*/}
     <div className="h-[17.5rem] w-[12rem] rounded-2xl absolute top-[25%] left-[40%] shadow bg-teal-100">
      Card 2
     </div>
     {/* Card Image 3*/}
     <div className="h-[17.5rem] w-[12rem] rounded-2xl absolute top-[46%] -left-1/2 translate-x-1/2 shadow bg-rose-100">
      Card 3
     </div>
     {/* Card Image 4*/}
     <div className="h-[17.5rem] w-[12rem] rounded-2xl absolute top-[68%] left-[40%] shadow bg-fuchsia-100">
      Card 4
     </div>
    </div>
   </div>
   {/* Our mission */}
   <div className="px-6 py-24 sm:py-32 lg:px-8">
    <div className="mx-auto mt-16">
     <h2 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 text-left sm:text-6xl dark:text-zinc-100">
      Our mission
     </h2>
     <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300 text-gray-300">
      To change the way parents, teachers and administrators interact with their
      students' reports and progress to give a better feedback for a more
      conductive and condusive response and action for their students, inorder
      for a better outcome and performance.
     </p>
    </div>
   </div>
   <div className="w-full h-40 bg-cyan-100 mt-12"></div>
   {/* Our Values */}
   <div className="px-6 py-24 sm:py-32 lg:px-8 mt-8">
    <div className="mx-auto mt-16">
     <h2 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 text-left sm:text-6xl dark:text-zinc-100">
      Our values
     </h2>
     <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300 dark:text-gray-300">
      Our values are clear, simple and easy to grasp in adherence of delivering
      the best services and customer care.
     </p>
    </div>
    <div className="mx-auto mt-16">
     {/* Value 1 */}
     <div className="mt-8">
      <h2 className="text-balance text-lg font-semibold tracking-tight text-gray-900 text-blue-100 sm:text-xl dark:text-zinc-100">
       Be constructive and innovative
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300 text-gray-300">
       Constructivity and innovation brings one the ability to build and
       implement <b> "out of the box" </b> ideas and makes problem solving
       easier hence speeding planning, development, and service deliverance.
      </p>
     </div>
     {/* Value 2 */}
     <div className="mt-16">
      <h2 className="text-balance text-lg font-semibold tracking-tight text-gray-900 text-left sm:text-xl dark:text-zinc-100">
       Be just and transparent
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300">
       Justification and transparency is paramount to our team's understanding
       and customer privacy protection and priotization. This helps us to create
       and protect a rightful image to the public.
      </p>
     </div>
     {/* Value 3 */}
     <div className="mt-16">
      <h2 className="text-balance text-lg font-semibold tracking-tight text-gray-900 text-left sm:text-xl dark:text-zinc-100">
       Always ready to learn
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300">
       Learning never ends but always has new things to keep us updated.
       Learning from circumstances like service clarity, customer feedback,
       development processing, which brings us close to customer and developer
       expectations and wants.
      </p>
     </div>
     {/* Value 4 */}
     <div className="mt-16">
      <h2 className="text-balance text-lg font-semibold tracking-tight text-gray-900 text-left sm:text-xl dark:text-zinc-100">
       Togetherness solves but solitude doesn't
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300">
       Working together is the best solution for higher, further and faster
       development and implementiton therefore giving a better thrust for self
       and project improvement.
      </p>
     </div>
     {/* Value 5 */}
     <div className="mt-16">
      <h2 className="text-balance text-lg font-semibold tracking-tight text-gray-900 text-left sm:text-xl dark:text-zinc-100">
       Be clear and concise
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300">
       Our team strives to be clear and concise about any small press talks or
       presentations on product showcasing and customer interactions. This helps
       everyone to know what we want to archive.
      </p>
     </div>
     {/*  */}
     <div className="mt-16">
      <h2 className="text-balance text-lg font-semibold tracking-tight text-gray-900 text-left sm:text-xl dark:text-zinc-100">
       Be constructive and innovative
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300">
       Constructivity and innovation brings one the ability to build and
       implement <b> "out of the box" </b> ideas and makes problem solving
       easier.
      </p>
     </div>
    </div>
   </div>
   {/* Our Team */}
   <div className="px-6 py-24 sm:py-32 lg:px-8">
    <div className="mx-auto mt-16">
     <h2 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 text-left sm:text-6xl dark:text-zinc-100">
      Our team
     </h2>
     <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300 text-gray-300">
      We're a dynamic group of individuals who are passionate about what we do
      and dedicated to delivering the best results for our clients.
     </p>
    </div>
    <div className="mx-auto mt-16 grid grid-cols-2 sm:grid-cols-3 gap-2">
     {teamMembers.map(teamMember => (
      <ProfileCard img="" name={teamMember.name} role={teamMember.role} />
     ))}
    </div>
   </div>
   {/* From the blog */}
   <div className="px-6 py-24 sm:py-32 lg:px-8">
    <div className="mx-auto mt-16">
     <h2 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 text-left sm:text-6xl dark:text-zinc-100">
      From the blog
     </h2>
     <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-300 text-gray-300">
      Get new and latest updates, technologies and resources from the community
      and our team.
     </p>
    </div>
    <div className="mx-auto mt-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
     {blogs.map(blog => (
      <BlogCard
       key={blog.id}
       id={blog.id}
       blog_Img={blog.blog_Img}
       topics={blog.topics}
       timePosted={blog.timePosted}
       user={blog.user}
       title={blog.title}
      />
     ))}
    </div>
   </div>
  </div>
 );
};

const ProfileCard = ({ img, name, role }) => (
 <div className="px-3 py-2.5 flex flex-col justify-center items-center gap-2">
  <img src="" alt="" className="w-24 h-24 rounded-full bg-amber-200" />
  <span className="font-semibold text-black text-base dark:text-white mt-4 text-center">
   {name}
  </span>
  <span className="font-normal text-slate-600 text-sm dark:text-slate-200 text-center text-sm">
   {role}
  </span>
 </div>
);

const BlogCard = ({ id, blog_Img, topics, timePosted, user, title }) => {
 const { name, image } = user;
 return (
  <div className="h-[32rem] w-full rounded-lg relative overflow-hidden" id={id}>
   <img
    src={blog_Img}
    alt={blog_Img}
    className="w-full h-full bg-amber-100 rounded-xl"
   />
   <div className="w-full h-[65%] px-6 pt-40 flex flex-col justify-center absolute bottom-0 rounded-b-lg bg-gradient-to-b from-transparent dark:to-slate-800/40 to-slate-600/40 to-70%">
    <div className="w-full flex items-center mb-2 gap-2 overflow-x-auto">
     {topics.map(topic => (
      <Badge text={topic} />
     ))}
    </div>
    <span className="text-zinc-100 text-sm">{timePosted}</span>
    <div className="w-full flex gap-4">
     <div>{image}</div>
     <span className="text-slate-100">{name}</span>
    </div>
    <div className="font-semibold text-lg text-white">{title}</div>
   </div>
  </div>
 );
};

export const Badge = ({ text }) => {
 return (
  <div className="no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px py-0.5 text-xs font-semibold leading-6 text-white inline-block">
   <div className="relative flex space-x-2 items-center z-10 rounded-full px-2 ring-1 ring-white/60">
    <span>{text}</span>
   </div>
  </div>
 );
};

export default About;
