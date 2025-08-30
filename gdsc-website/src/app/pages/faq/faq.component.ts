import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs = [
    {
      question: 'What is GDSC Portal?',
      answer: 'GDSC Portal is a comprehensive platform for managing Google Developer Student Clubs, including exam management, certification, and institute partnerships.'
    },
    {
      question: 'How can I register as a student?',
      answer: 'Students can register through the student portal by providing their basic information and selecting their institute.'
    },
    {
      question: 'How can institutes partner with GDSC?',
      answer: 'Institutes can apply for partnership through the institute portal, providing necessary documentation and meeting the required criteria.'
    },
    {
      question: 'How are certificates verified?',
      answer: 'Certificates can be verified using the unique certificate ID through our verification system.'
    }
  ];

  expandedFaq: number | null = null;

  toggleFaq(index: number) {
    this.expandedFaq = this.expandedFaq === index ? null : index;
  }
}
