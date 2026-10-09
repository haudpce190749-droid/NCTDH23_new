const bcrypt = require('bcryptjs');
const db = require('./db');

const seedData = async () => {
  await db.initPromise;
  console.log('Đang kiểm tra và khởi tạo dữ liệu...');

  try {
    // Luôn dọn dẹp các bài tuyển dụng và doanh nghiệp liên quan đến FPT nếu có trong CSDL
    await db.asyncRun(`
      DELETE FROM jobs 
      WHERE company_id IN (SELECT id FROM company_profiles WHERE company_name LIKE '%FPT%')
         OR title LIKE '%FPT%' 
         OR description LIKE '%FPT%' 
         OR benefits LIKE '%FPT%'
    `);
    await db.asyncRun(`
      DELETE FROM company_profiles WHERE company_name LIKE '%FPT%'
    `);

    // Check if data already exists
    const existingUsers = await db.asyncGet('SELECT COUNT(*) as count FROM users');
    if (existingUsers && existingUsers.count > 0) {
      console.log('CSDL đã có dữ liệu mẫu. Bỏ qua bước seed ban đầu.');
      return;
    }

    const passwordHash = await bcrypt.hash('student123', 10);
    const companyPasswordHash = await bcrypt.hash('company123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // 1. Create Users
    // Student 1
    const resStud1 = await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['student@example.com', passwordHash, 'student']
    );
    const stud1UserId = resStud1.lastID;

    // Student 2
    const resStud2 = await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['nguyenvana@example.com', passwordHash, 'student']
    );
    const stud2UserId = resStud2.lastID;

    // Company 1 - FPT Software
    const resComp1 = await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['company@example.com', companyPasswordHash, 'company']
    );
    const comp1UserId = resComp1.lastID;

    // Company 2 - VNG Corporation
    const resComp2 = await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['hr@vng.com.vn', companyPasswordHash, 'company']
    );
    const comp2UserId = resComp2.lastID;

    // Company 3 - Viettel Digital
    const resComp3 = await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['recruitment@viettel.vn', companyPasswordHash, 'company']
    );
    const comp3UserId = resComp3.lastID;

    // Company 4 - Shopee Vietnam
    const resComp4 = await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['careers@shopee.vn', companyPasswordHash, 'company']
    );
    const comp4UserId = resComp4.lastID;

    // Company 5 - MoMo (M-Service)
    const resComp5 = await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['tuyendung@momo.vn', companyPasswordHash, 'company']
    );
    const comp5UserId = resComp5.lastID;

    // Admin
    await db.asyncRun(
      `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      ['admin@example.com', adminPasswordHash, 'admin']
    );

    // 2. Student Profiles
    const resStudProf1 = await db.asyncRun(
      `INSERT INTO student_profiles (user_id, full_name, phone, location, bio, university, major, graduation_year, gpa, linkedin_url, github_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        stud1UserId,
        'Trần Minh Khoa',
        '0987654321',
        'Hà Nội',
        'Sinh viên năm cuối chuyên ngành Công nghệ thông tin, đam mê lập trình Web Full-Stack và trí tuệ nhân tạo. Rất mong muốn tìm công việc thực tập hoặc Fresher tại các công ty công nghệ hàng đầu.',
        'Đại học Bách Khoa Hà Nội',
        'Công nghệ Thông tin',
        2025,
        3.65,
        'https://linkedin.com/in/tranminhkhoa',
        'https://github.com/tranminhkhoa'
      ]
    );
    const stud1ProfId = resStudProf1.lastID;

    const resStudProf2 = await db.asyncRun(
      `INSERT INTO student_profiles (user_id, full_name, phone, location, bio, university, major, graduation_year, gpa, linkedin_url, github_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        stud2UserId,
        'Nguyễn Văn An',
        '0912345678',
        'TP. Hồ Chí Minh',
        'Sinh viên ngành Thiết kế Đồ họa & UX/UI. Thích tạo ra các giao diện người dùng hiện đại, tinh tế và tối ưu trải nghiệm.',
        'Đại học Kiến Trúc TP.HCM',
        'Thiết kế Đồ họa / UX-UI',
        2024,
        3.42,
        'https://linkedin.com/in/nguyenvana',
        'https://github.com/nguyenvana'
      ]
    );
    const stud2ProfId = resStudProf2.lastID;

    // Student 1 Education & Skills
    await db.asyncRun(
      `INSERT INTO student_education (student_id, university, major, graduation_year, gpa, degree) VALUES (?, ?, ?, ?, ?, ?)`,
      [stud1ProfId, 'Đại học Bách Khoa Hà Nội', 'Khoa học Máy tính', 2025, 3.65, 'Cử nhân']
    );

    const skills1 = ['ReactJS', 'Node.js', 'TypeScript', 'Tailwind CSS', 'SQLite/PostgreSQL', 'Git'];
    for (const skill of skills1) {
      await db.asyncRun(
        `INSERT INTO student_skills (student_id, skill_name, skill_level) VALUES (?, ?, ?)`,
        [stud1ProfId, skill, 'Thành thạo']
      );
    }

    await db.asyncRun(
      `INSERT INTO student_experience (student_id, company, position, start_date, end_date, is_current, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        stud1ProfId,
        'TechVn Startup',
        'Thực tập sinh Frontend',
        '2024-06-01',
        '2024-09-30',
        0,
        'Phát triển giao diện React cho hệ thống quản lý kho, tối ưu hóa tốc độ tải trang 30%.'
      ]
    );

    await db.asyncRun(
      `INSERT INTO student_projects (student_id, title, description, technologies, project_url) VALUES (?, ?, ?, ?, ?)`,
      [
        stud1ProfId,
        'Hệ thống quản lý việc làm sinh viên (NCTDH23)',
        'Xây dựng nền tảng kết nối sinh viên và nhà tuyển dụng full-stack với Express và React.',
        'Node.js, Express, React, Vite, Tailwind, SQLite',
        'https://github.com/tranminhkhoa/job-marketplace'
      ]
    );

    // 3. Company Profiles
    const resCompProf1 = await db.asyncRun(
      `INSERT INTO company_profiles (user_id, company_name, description, industry, company_size, location, website, contact_email, contact_phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comp1UserId,
        'VNPT Technology',
        'VNPT Technology là doanh nghiệp công nghệ cao hàng đầu, tiên phong trong nghiên cứu phát triển phần mềm, giải pháp IoT và hạ tầng chuyển đổi số.',
        'Công nghệ thông tin / Viễn thông',
        '1000+ nhân viên',
        'Hà Nội / TP.HCM / Cần Thơ',
        'https://vnpt-technology.vn',
        'recruitment@vnpt.vn',
        '024 7300 7300'
      ]
    );
    const comp1ProfId = resCompProf1.lastID;

    const resCompProf2 = await db.asyncRun(
      `INSERT INTO company_profiles (user_id, company_name, description, industry, company_size, location, website, contact_email, contact_phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comp2UserId,
        'VNG Corporation',
        'VNG là công ty công nghệ hàng đầu Việt Nam, nổi tiếng với ứng dụng Zalo, ZaloPay, Zing và mảng phát hành game trực tuyến.',
        'Internet / Trò chơi điện tử / Fintech',
        '1000+ nhân viên',
        'TP. Hồ Chí Minh (VNG Campus)',
        'https://vng.com.vn',
        'careers@vng.com.vn',
        '028 3962 3888'
      ]
    );
    const comp2ProfId = resCompProf2.lastID;

    const resCompProf3 = await db.asyncRun(
      `INSERT INTO company_profiles (user_id, company_name, description, industry, company_size, location, website, contact_email, contact_phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comp3UserId,
        'Viettel Digital',
        'Tổng Công ty Dịch vụ Số Viettel (Viettel Digital) chuyên cung cấp các giải pháp tài chính số Viettel Money, dữ liệu lớn và AI.',
        'Tài chính số / Viễn thông',
        '500-1000 nhân viên',
        'Hà Nội',
        'https://vietteldigital.vn',
        'tuyendung@viettel.vn',
        '024 6255 6789'
      ]
    );
    const comp3ProfId = resCompProf3.lastID;

    const resCompProf4 = await db.asyncRun(
      `INSERT INTO company_profiles (user_id, company_name, description, industry, company_size, location, website, contact_email, contact_phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comp4UserId,
        'Shopee Việt Nam',
        'Shopee là nền tảng thương mại điện tử hàng đầu tại Đông Nam Á và Đài Loan.',
        'Thương mại điện tử',
        '1000+ nhân viên',
        'TP. Hồ Chí Minh',
        'https://shopee.vn',
        'careers@shopee.vn',
        '028 7308 1221'
      ]
    );
    const comp4ProfId = resCompProf4.lastID;

    const resCompProf5 = await db.asyncRun(
      `INSERT INTO company_profiles (user_id, company_name, description, industry, company_size, location, website, contact_email, contact_phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comp5UserId,
        'Ví Điện Tử MoMo',
        'MoMo là Siêu ứng dụng thanh toán hàng đầu Việt Nam với hơn 31 triệu người dùng.',
        'Fintech / Siêu ứng dụng',
        '1000+ nhân viên',
        'TP. Hồ Chí Minh',
        'https://momo.vn',
        'recruitment@momo.vn',
        '028 5412 5412'
      ]
    );
    const comp5ProfId = resCompProf5.lastID;

    // 4. Jobs List (20 Jobs)
    const jobs = [
      {
        company_id: comp1ProfId,
        title: 'Thực Tập Sinh Lập Trình ReactJS / Frontend',
        category: 'Công nghệ thông tin',
        job_type: 'Internship',
        experience_level: 'Thực tập sinh',
        work_location_type: 'Hybrid',
        location: 'Hà Nội',
        salary_min: 4000000,
        salary_max: 7000000,
        salary_negotiable: 0,
        description: 'Chúng tôi đang tìm kiếm các bạn sinh viên năm 3, 4 hoặc mới tốt nghiệp có nền tảng JavaScript/ReactJS tốt tham gia chương trình Fresher/Internship tại VNPT Technology.',
        responsibilities: 'Tham gia phát triển các sản phẩm Web SPA cho khách hàng quốc tế. Viết unit test và làm việc cùng mentor senior.',
        requirements: 'Nắm vững kiến thức HTML, CSS, JavaScript (ES6+). Đã từng làm bài tập lớn hoặc dự án cá nhân bằng ReactJS.',
        benefits: 'Hỗ trợ trợ cấp hàng tháng từ 4-7 triệu. Được đào tạo bài bản 1-1 với Chuyên gia. Cơ hội ký hợp đồng chính thức sau 3 tháng.',
        deadline: '2026-12-31',
        skills: ['ReactJS', 'JavaScript', 'CSS3', 'Git']
      },
      {
        company_id: comp1ProfId,
        title: 'Fresher Node.js / Backend Developer',
        category: 'Công nghệ thông tin',
        job_type: 'Full-time',
        experience_level: 'Sinh viên mới tốt nghiệp',
        work_location_type: 'Tại văn phòng',
        location: 'Hà Nội',
        salary_min: 10000000,
        salary_max: 15000000,
        salary_negotiable: 0,
        description: 'Tham gia xây dựng các dịch vụ backend microservices quy mô lớn sử dụng Node.js, Express và MongoDB/PostgreSQL.',
        responsibilities: 'Thiết kế RESTful API, tối ưu hóa truy vấn CSDL, tích hợp các dịch vụ bên thứ ba.',
        requirements: 'Tốt nghiệp đại học chuyên ngành CNTT. Hiểu rõ asynchronous programming trong Node.js.',
        benefits: 'Lương thưởng cạnh tranh, bảo hiểm chăm sóc sức khỏe toàn diện, gói khám sức khỏe định kỳ. Du lịch nghỉ mát hàng năm.',
        deadline: '2026-11-30',
        skills: ['Node.js', 'Express', 'SQL', 'RESTful API']
      },
      {
        company_id: comp2ProfId,
        title: 'Thực Tập Sinh UI/UX Designer',
        category: 'Thiết kế / Đồ họa',
        job_type: 'Internship',
        experience_level: 'Thực tập sinh',
        work_location_type: 'Tại văn phòng',
        location: 'TP. Hồ Chí Minh',
        salary_min: 5000000,
        salary_max: 8000000,
        salary_negotiable: 0,
        description: 'Tham gia cùng nhóm thiết kế sản phẩm Zalo/ZaloPay để nghiên cứu hành vi người dùng và tạo ra luồng trải nghiệm xuất sắc.',
        responsibilities: 'Thiết kế wireframe, prototype, UI components cho ứng dụng di động và web.',
        requirements: 'Sử dụng thành thạo Figma. Có portfolio sản phẩm cá nhân hoặc đồ án môn học.',
        benefits: 'Môi trường làm việc đẳng cấp tại VNG Campus. Căng tin miễn phí đồ ăn sáng & trưa. Trợ cấp thực tập hấp dẫn.',
        deadline: '2026-12-15',
        skills: ['Figma', 'UI/UX', 'Prototyping', 'Design System']
      },
      {
        company_id: comp2ProfId,
        title: 'Lập Trình Viên Mobile (Flutter / React Native) Junior',
        category: 'Công nghệ thông tin',
        job_type: 'Full-time',
        experience_level: '1-2 năm',
        work_location_type: 'Hybrid',
        location: 'TP. Hồ Chí Minh',
        salary_min: 15000000,
        salary_max: 22000000,
        salary_negotiable: 0,
        description: 'Phát triển các tính năng mới trên ứng dụng di động tiếp cận hàng triệu người dùng hàng ngày.',
        responsibilities: 'Xây dựng giao diện mượt mà, tối ưu hiệu năng ứng dụng di động đa nền tảng.',
        requirements: 'Có kinh nghiệm với Flutter hoặc React Native. Hiểu về State Management (Provider/Bloc/Redux).',
        benefits: 'Thưởng tháng 13 + thưởng hiệu quả kinh doanh. Được cấp MacBook Pro làm việc.',
        deadline: '2026-11-15',
        skills: ['Flutter', 'React Native', 'Mobile App', 'Dart']
      },
      {
        company_id: comp3ProfId,
        title: 'Thực Tập Sinh Data Analyst / Phân Tích Dữ Liệu',
        category: 'Dữ liệu / AI',
        job_type: 'Internship',
        experience_level: 'Thực tập sinh',
        work_location_type: 'Tại văn phòng',
        location: 'Hà Nội',
        salary_min: 5000000,
        salary_max: 8000000,
        salary_negotiable: 0,
        description: 'Tham gia trích xuất, làm sạch dữ liệu giao dịch và tạo dashboard theo dõi chỉ số kinh doanh tại Viettel Digital.',
        responsibilities: 'Viết truy vấn SQL phức tạp, thiết kế báo cáo PowerBI / Tableau.',
        requirements: 'Sinh viên các ngành Toán tin, Thống kê, CNTT, Kinh tế. Thành thạo SQL và Excel.',
        benefits: 'Cơ hội tiếp xúc kho dữ liệu Big Data hàng chục terabyte. Được hướng dẫn bởi các Data Scientist hàng đầu.',
        deadline: '2026-12-20',
        skills: ['SQL', 'Python', 'PowerBI', 'Excel']
      },
      {
        company_id: comp3ProfId,
        title: 'Kỹ Sư Kiểm Thử Phần Mềm (QA/QC Tester) - Fresher',
        category: 'Công nghệ thông tin',
        job_type: 'Full-time',
        experience_level: 'Sinh viên mới tốt nghiệp',
        work_location_type: 'Tại văn phòng',
        location: 'Hà Nội',
        salary_min: 9000000,
        salary_max: 13000000,
        salary_negotiable: 0,
        description: 'Tham gia viết test case, thực hiện manual testing và tự động hóa kiểm thử cho ứng dụng Viettel Money.',
        responsibilities: 'Phân tích yêu cầu bài toán, tạo test scenarios, ghi nhận lỗi và làm việc với nhóm Dev.',
        requirements: 'Tốt nghiệp chuyên ngành CNTT hoặc có chứng chỉ ISTQB Foundation. Cẩn thận, chỉn chu.',
        benefits: 'Môi trường làm việc chuyên nghiệp, cơ hội thăng tiến rõ ràng, thưởng các ngày lễ tết.',
        deadline: '2026-11-25',
        skills: ['Manual Testing', 'Test Case', 'Postman', 'Jira']
      },
      {
        company_id: comp4ProfId,
        title: 'Chuyên Viên Marketing Online / Digital Marketing Intern',
        category: 'Marketing / Truyền thông',
        job_type: 'Internship',
        experience_level: 'Thực tập sinh',
        work_location_type: 'Tại văn phòng',
        location: 'TP. Hồ Chí Minh',
        salary_min: 4500000,
        salary_max: 7000000,
        salary_negotiable: 0,
        description: 'Tham gia hỗ trợ triển khai các chiến dịch quảng cáo và sự kiện mua sắm lớn (9.9, 11.11, 12.12) tại Shopee.',
        responsibilities: 'Quản lý kênh truyền thông social, sáng tạo nội dung fanpage, theo dõi hiệu quả chạy ads.',
        requirements: 'Sinh viên ưu tú ngành Marketing, Kinh tế, Truyền thông. Tiếng Anh giao tiếp tốt.',
        benefits: 'Môi trường trẻ trung, năng động chuẩn tập đoàn đa quốc gia. Trợ cấp thực tập cao.',
        deadline: '2026-12-10',
        skills: ['Content Marketing', 'Social Media', 'Copywriting', 'English']
      },
      {
        company_id: comp4ProfId,
        title: 'Business Development Specialist / Phát Triển Kinh Doanh (Fresher)',
        category: 'Kinh doanh / Bán hàng',
        job_type: 'Full-time',
        experience_level: 'Sinh viên mới tốt nghiệp',
        work_location_type: 'Tại văn phòng',
        location: 'TP. Hồ Chí Minh',
        salary_min: 10000000,
        salary_max: 16000000,
        salary_negotiable: 0,
        description: 'Tìm kiếm, kết nối và hỗ trợ nhà bán hàng đối tác tối ưu hóa cửa hàng trực tuyến trên sàn Shopee.',
        responsibilities: 'Tư vấn giải pháp tăng doanh số cho nhà bán, đàm phán chương trình khuyến mãi.',
        requirements: 'Kỹ năng giao tiếp và thuyết phục tốt. Năng động, chịu được áp lực chỉ tiêu kinh doanh.',
        benefits: 'Lương cứng + Hoa hồng theo doanh số hấp dẫn. Lộ trình thăng tiến 6 tháng/lần.',
        deadline: '2026-11-30',
        skills: ['Sales', 'Negotiation', 'Communication', 'Data Analysis']
      },
      {
        company_id: comp5ProfId,
        title: 'Thực Tập Sinh Lập Trình Python / AI Assistant',
        category: 'Dữ liệu / AI',
        job_type: 'Internship',
        experience_level: 'Thực tập sinh',
        work_location_type: 'Hybrid',
        location: 'TP. Hồ Chí Minh',
        salary_min: 6000000,
        salary_max: 9000000,
        salary_negotiable: 0,
        description: 'Hỗ trợ nghiên cứu các mô hình AI/LLM, xây dựng chatbot chăm sóc khách hàng tự động tại MoMo.',
        responsibilities: 'Thu thập và tiền xử lý dữ liệu ngôn ngữ tự nhiên (NLP), huấn luyện mô hình cơ bản.',
        requirements: 'Thành thạo Python, có nền tảng về Machine Learning / Deep Learning / PyTorch.',
        benefits: 'Được hỗ trợ chi phí ăn trưa, gửi xe. Học hỏi trực tiếp từ Tiến sĩ/Thạc sĩ AI.',
        deadline: '2026-12-30',
        skills: ['Python', 'PyTorch', 'NLP', 'Machine Learning']
      },
      {
        company_id: comp5ProfId,
        title: 'Chuyên Viên Tuyển Dụng Nhân Sự (HR Recruiter Intern)',
        category: 'Nhân sự / Hành chính',
        job_type: 'Internship',
        experience_level: 'Thực tập sinh',
        work_location_type: 'Tại văn phòng',
        location: 'TP. Hồ Chí Minh',
        salary_min: 4000000,
        salary_max: 6500000,
        salary_negotiable: 0,
        description: 'Tham gia vào quy trình tuyển dụng tài năng IT và Khối Văn phòng cho MoMo.',
        responsibilities: 'Đăng tin tuyển dụng, sàng lọc hồ sơ CV, sắp xếp lịch phỏng vấn và hỗ trợ onboarding.',
        requirements: 'Sinh viên các ngành Quản trị nhân sự, Quản trị kinh doanh, Ngoại ngữ.',
        benefits: 'Cơ hội chuyển thành Nhân viên chính thức sau kỳ thực tập 3 tháng.',
        deadline: '2026-12-15',
        skills: ['HR', 'Sourcing', 'Interviewing', 'Communication']
      }
    ];

    for (const job of jobs) {
      const skills = job.skills;
      delete job.skills;

      const resJob = await db.asyncRun(
        `INSERT INTO jobs (company_id, title, category, job_type, experience_level, work_location_type, location, salary_min, salary_max, salary_negotiable, description, responsibilities, requirements, benefits, deadline, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
        [
          job.company_id,
          job.title,
          job.category,
          job.job_type,
          job.experience_level,
          job.work_location_type,
          job.location,
          job.salary_min,
          job.salary_max,
          job.salary_negotiable,
          job.description,
          job.responsibilities,
          job.requirements,
          job.benefits,
          job.deadline
        ]
      );
      const jobId = resJob.lastID;

      for (const sk of skills) {
        await db.asyncRun(`INSERT INTO job_skills (job_id, skill_name) VALUES (?, ?)`, [jobId, sk]);
      }
    }

    // 5. Applications sample
    await db.asyncRun(
      `INSERT INTO applications (job_id, student_id, cover_letter, contact_phone, contact_email, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        1,
        stud1ProfId,
        'Kính gửi Bộ phận Tuyển dụng VNPT Technology. Em rất tự tin với kiến thức ReactJS và dự án thực tế đã hoàn thành.',
        '0987654321',
        'student@example.com',
        'reviewing'
      ]
    );

    await db.asyncRun(
      `INSERT INTO applications (job_id, student_id, cover_letter, contact_phone, contact_email, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        3,
        stud2ProfId,
        'Kính gửi Nhóm tuyển dụng VNG. Em đính kèm portfolio thiết kế UI/UX ứng dụng Zalo bổ sung.',
        '0912345678',
        'nguyenvana@example.com',
        'shortlisted'
      ]
    );

    // 6. Saved jobs sample
    await db.asyncRun(`INSERT INTO saved_jobs (student_id, job_id) VALUES (?, ?)`, [stud1ProfId, 2]);
    await db.asyncRun(`INSERT INTO saved_jobs (student_id, job_id) VALUES (?, ?)`, [stud1ProfId, 5]);

    console.log('Khởi tạo dữ liệu mẫu thành công (Seed data complete)!');
  } catch (err) {
    console.error('Lỗi khi chạy seed data:', err);
  }
};

seedData();
