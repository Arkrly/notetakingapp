import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page">
      <!-- Navigation -->
      <nav class="nav">
        <div class="nav-content">
          <a routerLink="/" class="logo">
            <div class="logo-icon">N</div>
            <span>NoteStack</span>
          </a>
          <div class="nav-links">
            <a href="#features" (click)="scrollToSection($event, 'features')">Features</a>
            <a href="#testimonials" (click)="scrollToSection($event, 'testimonials')">Reviews</a>
            <a href="#faq" (click)="scrollToSection($event, 'faq')">FAQ</a>
            <a routerLink="/register" class="nav-cta">Get Started</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-badge">
                <span class="badge-icon">✨</span>
                <span>Free for College Students</span>
              </div>
              <h1 class="hero-title">
                Capture Ideas.<br>
                <span class="gradient-text">Organize Everything.</span>
              </h1>
              <p class="hero-subtitle">
                NoteStack is a cloud-based note-taking app built for students and professionals.
                Never lose an idea again—access your notes from anywhere, on any device.
              </p>
              <div class="hero-cta">
                <a routerLink="/register" class="btn btn-primary">
                  <span>Start for Free</span>
                  <span class="arrow">→</span>
                </a>
                <a href="#features" class="btn btn-secondary" (click)="scrollToSection($event, 'features')">
                  See Features
                </a>
              </div>
            </div>
            <div class="hero-image">
              <div class="mockup">
                <div class="mockup-card">
                  <div class="mockup-icon">📚</div>
                  <div class="mockup-title">Lecture Notes</div>
                  <div class="mockup-text">CS 101 - Data Structures & Algorithms...</div>
                </div>
                <div class="mockup-card">
                  <div class="mockup-icon">💡</div>
                  <div class="mockup-title">Project Ideas</div>
                  <div class="mockup-text">Note-taking app with JWT auth...</div>
                </div>
                <div class="mockup-card">
                  <div class="mockup-icon">✅</div>
                  <div class="mockup-title">Todo List</div>
                  <div class="mockup-text">Complete landing page, fix API...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="trust">
        <div class="container">
          <p class="trust-text">Trusted by students at</p>
          <div class="trust-logos">
            <span class="trust-logo">MIT</span>
            <span class="trust-logo">Stanford</span>
            <span class="trust-logo">Harvard</span>
            <span class="trust-logo">Berkeley</span>
            <span class="trust-logo">CMU</span>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" id="features">
        <div class="container">
          <div class="section-header">
            <h2>Everything You Need</h2>
            <p>Powerful features designed to make note-taking effortless and organized</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">☁️</div>
              <h3>Cloud Sync</h3>
              <p>Your notes are automatically synced across all devices. Access them anytime, anywhere.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>Secure Authentication</h3>
              <p>JWT-based authentication keeps your notes private and secure. Only you can access them.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Fast & Responsive</h3>
              <p>Built with Angular Material for a smooth, responsive experience on all devices.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3>Clean Interface</h3>
              <p>Minimalist design focused on your content. No clutter, no distractions.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Quick Search</h3>
              <p>Find any note instantly with powerful search. Filter by title, content, or date.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>Fully responsive design works beautifully on phones and tablets. Take notes on the go.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Notes Created</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">2,500+</div>
              <div class="stat-label">Happy Users</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">Uptime</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.8/5</div>
              <div class="stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials" id="testimonials">
        <div class="container">
          <div class="section-header">
            <h2>Loved by Students</h2>
            <p>See what our users are saying about NoteStack</p>
          </div>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-text">"NoteStack has completely changed how I organize my lecture notes. The search feature is a game-changer for exam prep!"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">SJ</div>
                <div class="testimonial-info">
                  <h4>Sarah Johnson</h4>
                  <p>Computer Science Student</p>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-text">"Finally a note app that doesn't try to do everything. Simple, fast, and exactly what I need for my projects."</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">MC</div>
                <div class="testimonial-info">
                  <h4>Michael Chen</h4>
                  <p>Software Engineering Major</p>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-text">"The JWT authentication gives me peace of mind. Plus, it looks great on both my laptop and phone!"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">EP</div>
                <div class="testimonial-info">
                  <h4>Emily Parker</h4>
                  <p>Information Systems Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq" id="faq">
        <div class="container">
          <div class="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We've got answers.</p>
          </div>
          <div class="faq-grid">
            <div class="faq-item" *ngFor="let item of faqItems; let i = index" [class.active]="item.isOpen">
              <div class="faq-question" (click)="toggleFaq(i)">
                <span>{{ item.question }}</span>
                <span class="faq-icon" [class.rotate]="item.isOpen">+</span>
              </div>
              <div class="faq-answer" [class.show]="item.isOpen">
                {{ item.answer }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <h2>Ready to Get Organized?</h2>
          <p>Join thousands of students who trust NoteStack for their note-taking needs. It's free and takes less than a minute to get started.</p>
          <div class="cta-buttons">
            <a routerLink="/register" class="btn btn-white">
              <span>Create Free Account</span>
              <span class="arrow">→</span>
            </a>
            <a routerLink="/login" class="btn btn-outline">Sign In</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-logo">
              <div class="logo-icon">N</div>
              <span>NoteStack</span>
            </div>
            <div class="footer-links">
              <a href="#features" (click)="scrollToSection($event, 'features')">Features</a>
              <a href="#testimonials" (click)="scrollToSection($event, 'testimonials')">Reviews</a>
              <a href="#faq" (click)="scrollToSection($event, 'faq')">FAQ</a>
              <a routerLink="/login">Open App</a>
            </div>
            <p class="copyright">© 2025 NoteStack. Built for college projects.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .landing-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1f2937;
    }

    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Navigation */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      border-bottom: 1px solid #e5e7eb;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.5rem;
      color: #6366f1;
      text-decoration: none;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      color: #1f2937;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
      cursor: pointer;
    }

    .nav-links a:hover {
      color: #6366f1;
    }

    .nav-cta {
      background: #6366f1;
      color: white !important;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      transition: background 0.2s !important;
    }

    .nav-cta:hover {
      background: #4f46e5 !important;
    }

    /* Hero Section */
    .hero {
      padding: 8rem 0 5rem;
      background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero-content {
      max-width: 540px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .badge-icon {
      font-size: 1rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: #1f2937;
    }

    .gradient-text {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 1rem;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }

    .btn-primary:hover {
      background: #4f46e5;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }

    .btn-secondary {
      background: white;
      color: #1f2937;
      border: 2px solid #e5e7eb;
    }

    .btn-secondary:hover {
      border-color: #6366f1;
      color: #6366f1;
    }

    .arrow {
      transition: transform 0.2s;
    }

    .btn:hover .arrow {
      transform: translateX(4px);
    }

    .hero-image {
      position: relative;
    }

    .mockup {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      border: 1px solid #e5e7eb;
      position: relative;
    }

    .mockup::before {
      content: '';
      position: absolute;
      top: -20px;
      right: -20px;
      bottom: 20px;
      left: 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 16px;
      z-index: -1;
      opacity: 0.3;
    }

    .mockup-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .mockup-icon {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .mockup-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #1f2937;
    }

    .mockup-text {
      color: #6b7280;
      font-size: 0.875rem;
    }

    /* Trust Section */
    .trust {
      padding: 3rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .trust-text {
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .trust-logos {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3rem;
      flex-wrap: wrap;
    }

    .trust-logo {
      font-size: 1.25rem;
      font-weight: 600;
      color: #6b7280;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .trust-logo:hover {
      opacity: 1;
    }

    /* Features Section */
    .features {
      padding: 5rem 0;
      background: white;
    }

    .section-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 4rem;
    }

    .section-header h2 {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .section-header p {
      font-size: 1.125rem;
      color: #6b7280;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      border-radius: 16px;
      background: white;
      border: 1px solid #e5e7eb;
      transition: all 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
      border-color: #6366f1;
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #1f2937;
    }

    .feature-card p {
      color: #6b7280;
      line-height: 1.7;
    }

    /* Stats Section */
    .stats {
      padding: 5rem 0;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 3rem;
      text-align: center;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 1rem;
      opacity: 0.9;
    }

    /* Testimonials */
    .testimonials {
      padding: 5rem 0;
      background: #f9fafb;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
    }

    .testimonial-stars {
      color: #fbbf24;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      letter-spacing: 2px;
    }

    .testimonial-text {
      font-size: 1rem;
      color: #1f2937;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .testimonial-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .testimonial-info h4 {
      font-weight: 600;
      color: #1f2937;
    }

    .testimonial-info p {
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* FAQ Section */
    .faq {
      padding: 5rem 0;
      background: white;
    }

    .faq-grid {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-item {
      border-bottom: 1px solid #e5e7eb;
      padding: 1.5rem 0;
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-weight: 600;
      font-size: 1.125rem;
      color: #1f2937;
    }

    .faq-question:hover {
      color: #6366f1;
    }

    .faq-icon {
      font-size: 1.5rem;
      color: #6b7280;
      transition: transform 0.2s;
    }

    .faq-icon.rotate {
      transform: rotate(45deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease-out;
      color: #6b7280;
      line-height: 1.7;
    }

    .faq-answer.show {
      max-height: 200px;
      padding-top: 1rem;
    }

    /* CTA Section */
    .cta-section {
      padding: 5rem 0;
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: white;
      text-align: center;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-section p {
      font-size: 1.125rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-white {
      background: white;
      color: #1f2937;
    }

    .btn-white:hover {
      background: #f9fafb;
      transform: translateY(-2px);
    }

    .btn-outline {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .btn-outline:hover {
      border-color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Footer */
    .footer {
      background: #111827;
      color: white;
      padding: 3rem 0;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.5rem;
    }

    .footer-links {
      display: flex;
      gap: 2rem;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.2s;
      cursor: pointer;
    }

    .footer-links a:hover {
      color: white;
    }

    .copyright {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      width: 100%;
      text-align: center;
      margin-top: 1rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .hero {
        padding: 6rem 0 3rem;
      }

      .hero-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .hero-title {
        font-size: 2.25rem;
      }

      .hero-image {
        order: -1;
      }

      .section-header h2,
      .cta-section h2 {
        font-size: 1.75rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        gap: 2rem;
      }

      .stat-number {
        font-size: 2rem;
      }

      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
  faqItems = [
    {
      question: 'Is NoteStack free to use?',
      answer: 'Yes! NoteStack is completely free for college students. You get unlimited notes, cloud sync, and all features at no cost.',
      isOpen: false
    },
    {
      question: 'Can I access my notes on mobile?',
      answer: 'Absolutely! NoteStack is fully responsive and works on any device with a web browser. Just log in and your notes are there.',
      isOpen: false
    },
    {
      question: 'How secure are my notes?',
      answer: 'Very secure! We use JWT authentication and all data is stored in PostgreSQL with proper encryption. Only you can access your notes.',
      isOpen: false
    },
    {
      question: 'What if I forget my password?',
      answer: 'No worries! Use the password reset feature on the login page. We\'ll send you a secure link to create a new password.',
      isOpen: false
    },
    {
      question: 'Can I export my notes?',
      answer: 'Yes, you can export your notes in various formats. We\'re working on adding more export options in future updates.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
