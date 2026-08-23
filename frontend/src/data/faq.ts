export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "Account & Profile",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Click Sign up in the top navigation, enter your nickname, email, and password. You'll be signed in automatically once your account is created.",
      },
      {
        question: "How do I update my profile picture or contact details?",
        answer:
          "Go to My Page from the navigation menu, then edit your nickname, phone number, address, or profile picture and save your changes.",
      },
      {
        question: "I forgot my password — what should I do?",
        answer:
          "There is currently no self-service password reset. Please contact the site administrator for help regaining access to your account.",
      },
    ],
  },
  {
    title: "Pets",
    items: [
      {
        question: "How do I add a pet to my profile?",
        answer:
          "Open My Pets from the navigation menu and click Add Pet. You can enter your pet's name, type, and an optional photo.",
      },
      {
        question: "Do I need to add a pet before I can place an order?",
        answer:
          "No — adding a pet is completely optional. You can browse products and check out without linking an order to a pet.",
      },
      {
        question: "Can I edit or remove a pet later?",
        answer:
          "Yes, from the My Pets page you can edit a pet's details or delete it at any time.",
      },
    ],
  },
  {
    title: "Orders & Payment",
    items: [
      {
        question: "What do the order statuses mean?",
        answer:
          "Paused means the order is placed but not yet paid for. Processing means payment has been confirmed and the order is being prepared. Finished means the order has been completed.",
      },
      {
        question: "Can I cancel an order after paying for it?",
        answer:
          "No. Orders can only be cancelled while they're in the Paused status. Once you complete payment and the order moves to Processing, cancellation is no longer available — please double-check your order before paying.",
      },
      {
        question: "Is my payment information real or stored anywhere?",
        answer:
          "No. This is a demo project with no real payment processor. The card details shown on the Orders page are placeholder data for display purposes only.",
      },
      {
        question: "Where can I see my past orders?",
        answer:
          "Go to My Orders to see your orders grouped by status: Paused, Processing, and Finished.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      {
        question: "How much does delivery cost?",
        answer:
          "A flat delivery fee of $5 is added to every order at checkout, regardless of order size.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "As a demo project, delivery isn't simulated in real time — orders move from Processing to Finished when marked complete.",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        question: "How do I find products for my pet?",
        answer:
          "Use the category filters on the Products page to browse by type (Food, Toys, Accessories, Supplements, Hygiene), or use the search bar to find a specific item.",
      },
      {
        question: "Can I sort products by price or popularity?",
        answer:
          "Yes — use the sort buttons on the Products page to sort by Newest, Best Seller, or Price (low to high).",
      },
      {
        question: "What happens if a product is out of stock?",
        answer:
          "Products with no remaining stock can't be added to an order. Stock is automatically restored if an order containing that product is cancelled while Paused.",
      },
    ],
  },
  {
    title: "AI Advisor",
    items: [
      {
        question: "What is the AI Advisor?",
        answer:
          "The AI Advisor is a chat assistant that gives pet care suggestions grounded in your saved pet profiles and order history.",
      },
      {
        question: "Does it know about my pets and past orders?",
        answer:
          "Yes — when relevant, the AI Advisor uses your pet profiles and order history to give more personalized answers.",
      },
      {
        question: "Is my chat data private?",
        answer:
          "Your chat sessions are tied to your account and are not visible to other members.",
      },
    ],
  },
];
