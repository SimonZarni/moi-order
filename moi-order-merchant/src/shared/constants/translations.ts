export type Language = 'en' | 'my';

export type TranslationKey =
  // ── Common ───────────────────────────────────────────────────────────────
  | 'common_save' | 'common_cancel' | 'common_back' | 'common_saving' | 'common_back_to_settings'
  | 'common_done' | 'common_edit' | 'common_delete' | 'common_add' | 'common_change' | 'common_remove'
  | 'common_upload' | 'common_uploading' | 'common_loading' | 'common_retry'
  | 'common_today' | 'common_yesterday' | 'common_last_7_days' | 'common_last_30_days'
  | 'common_orders' | 'common_pending' | 'common_cancelled' | 'common_all'
  | 'common_export_csv' | 'common_go_back' | 'common_search_customer_order'
  | 'common_no_data_period' | 'common_min' | 'common_optional'
  // ── Settings ─────────────────────────────────────────────────────────────
  | 'settings_title' | 'settings_preferences' | 'settings_account' | 'settings_restaurant'
  | 'settings_language' | 'settings_language_en' | 'settings_language_my'
  | 'settings_theme' | 'settings_theme_light' | 'settings_theme_dark'
  | 'settings_menu_view' | 'settings_menu_view_list' | 'settings_menu_view_grid'
  | 'settings_change_password' | 'settings_operating_hours'
  // ── Change Password ───────────────────────────────────────────────────────
  | 'change_password_title' | 'change_password_current' | 'change_password_new'
  | 'change_password_confirm' | 'change_password_success' | 'change_password_hint'
  // ── Operating Hours ───────────────────────────────────────────────────────
  | 'hours_title'
  | 'hours_day_sun' | 'hours_day_mon' | 'hours_day_tue' | 'hours_day_wed'
  | 'hours_day_thu' | 'hours_day_fri' | 'hours_day_sat'
  | 'hours_opens' | 'hours_closes' | 'hours_open' | 'hours_closed' | 'hours_not_set'
  | 'hours_session' | 'hours_add_session' | 'hours_edit_session_menu' | 'hours_session_menu_count'
  // ── Dashboard ─────────────────────────────────────────────────────────────
  | 'dashboard_title' | 'dashboard_greeting_morning' | 'dashboard_greeting_afternoon' | 'dashboard_greeting_evening'
  | 'dashboard_today_revenue' | 'dashboard_this_week' | 'dashboard_this_month'
  | 'dashboard_performance' | 'dashboard_top_sales' | 'dashboard_top_customers'
  | 'dashboard_pending_orders' | 'dashboard_recent_orders' | 'dashboard_no_recent_orders'
  | 'dashboard_quick_stats' | 'dashboard_total_orders_month' | 'dashboard_avg_order_value'
  | 'dashboard_activity' | 'dashboard_no_recent_activity' | 'dashboard_new_order_from'
  | 'dashboard_sold' | 'dashboard_no_data_period'
  | 'dashboard_period_today' | 'dashboard_period_week' | 'dashboard_period_month'
  | 'dashboard_orders_count' | 'dashboard_pending_count'
  // ── Orders ────────────────────────────────────────────────────────────────
  | 'orders_title' | 'orders_all' | 'orders_new' | 'orders_in_progress' | 'orders_done'
  | 'orders_cancelled_orders' | 'orders_search_placeholder' | 'orders_count'
  | 'orders_no_orders_found' | 'orders_no_orders_body_search' | 'orders_no_orders_body_filter'
  | 'orders_section_new' | 'orders_section_in_progress' | 'orders_section_done'
  | 'orders_back_to_today' | 'orders_pending_count'
  // ── Order Card ───────────────────────────────────────────────────────────
  | 'card_accept_order' | 'card_start_preparing' | 'card_mark_ready'
  | 'card_rider_picked_up' | 'card_mark_delivered' | 'card_complete_order'
  | 'prep_time_modal_title' | 'prep_time_modal_subtitle' | 'prep_time_modal_confirm'
  // ── Order Detail ─────────────────────────────────────────────────────────
  | 'order_detail_cannot_load' | 'order_detail_go_back'
  | 'order_detail_customer' | 'order_detail_name' | 'order_detail_phone'
  | 'order_detail_contact' | 'order_detail_address' | 'order_detail_notes'
  | 'order_detail_order_details' | 'order_detail_order_num' | 'order_detail_payment'
  | 'order_detail_placed' | 'order_detail_prep_time'
  | 'order_detail_items' | 'order_detail_subtotal' | 'order_detail_total'
  | 'order_detail_waiting_payment_note' | 'order_detail_chat_customer'
  | 'order_detail_how_long' | 'order_detail_updating' | 'order_detail_cancel_order'
  | 'order_detail_cancel_title' | 'order_detail_reason'
  | 'order_detail_additional_details' | 'order_detail_details_placeholder'
  | 'order_detail_keep_order' | 'order_detail_confirm_cancel'
  | 'order_detail_cancel_closing' | 'order_detail_cancel_sold_out' | 'order_detail_cancel_out_of_range'
  | 'action_accept' | 'action_start_preparing' | 'action_mark_ready_pickup'
  | 'action_rider_picked_up' | 'action_mark_delivered' | 'action_complete'
  | 'payment_cod' | 'payment_prompt_pay' | 'payment_line_pay'
  // ── Cancelled Orders ─────────────────────────────────────────────────────
  | 'cancelled_title' | 'cancelled_no_orders' | 'cancelled_no_orders_search' | 'cancelled_no_orders_period'
  | 'cancelled_section_label'
  // ── Analytics ────────────────────────────────────────────────────────────
  | 'analytics_all' | 'analytics_today' | 'analytics_week' | 'analytics_month'
  | 'analytics_revenue' | 'analytics_pending_now' | 'analytics_need_attention'
  | 'analytics_week_revenue' | 'analytics_month_revenue' | 'analytics_avg_order_value'
  | 'analytics_this_month'
  | 'analytics_performance_eyebrow' | 'analytics_page_title' | 'analytics_pending_suffix'
  | 'analytics_chart_revenue' | 'analytics_chart_orders'
  | 'analytics_chart_sub_today_week_month' | 'analytics_no_revenue' | 'analytics_no_orders'
  | 'analytics_chart_hourly' | 'analytics_chart_daily_7' | 'analytics_chart_daily_30'
  | 'analytics_no_period_data'
  | 'analytics_comparison_title' | 'analytics_col_period' | 'analytics_col_revenue' | 'analytics_col_orders'
  // ── Notifications ─────────────────────────────────────────────────────────
  | 'notif_title' | 'notif_inbox' | 'notif_mark_all_read'
  | 'notif_failed_load' | 'notif_retry' | 'notif_no_notifications' | 'notif_subtitle'
  // ── Profile ───────────────────────────────────────────────────────────────
  | 'profile_cover_hint' | 'profile_your_restaurant'
  | 'profile_account' | 'profile_name' | 'profile_email' | 'profile_phone'
  | 'profile_business' | 'profile_business_profile' | 'profile_settings' | 'profile_sign_out'
  // ── Chat ─────────────────────────────────────────────────────────────────
  | 'chat_title' | 'chat_no_messages' | 'chat_check_internet' | 'chat_cannot_load'
  | 'chat_type_message' | 'chat_locked' | 'chat_will_close' | 'chat_add_photo'
  | 'chat_notice_banner' | 'chat_reply_to' | 'chat_cancel_reply' | 'chat_photo'
  // ── Reviews ───────────────────────────────────────────────────────────────
  | 'reviews_title' | 'reviews_total' | 'reviews_loading' | 'reviews_cannot_load'
  | 'reviews_no_reviews' | 'reviews_no_reviews_body'
  // ── Login ─────────────────────────────────────────────────────────────────
  | 'login_email_label' | 'login_email_placeholder' | 'login_password_label'
  | 'login_sign_in' | 'login_signing_in' | 'login_show_password' | 'login_hide_password'
  | 'login_or_continue' | 'login_phone_instead' | 'login_no_account' | 'login_register'
  // ── Menu ──────────────────────────────────────────────────────────────────
  | 'menu_title' | 'menu_add_category' | 'menu_search_placeholder' | 'menu_all_category'
  | 'menu_no_items_search' | 'menu_no_items_empty' | 'menu_no_items_keyword' | 'menu_no_items_empty_hint'
  | 'menu_system_warn'
  | 'menu_add_item' | 'menu_new_category_title' | 'menu_rename_category_title' | 'menu_delete_category_title'
  | 'menu_category_name_placeholder' | 'menu_new_item_title' | 'menu_edit_item_title'
  | 'menu_save_changes' | 'menu_item_name_placeholder' | 'menu_item_desc_placeholder'
  | 'menu_price_label' | 'menu_original_price_label'
  | 'menu_options_title' | 'menu_add_group' | 'menu_required' | 'menu_min' | 'menu_max'
  | 'menu_group_name_placeholder' | 'menu_option_name_placeholder' | 'menu_add_option'
  | 'menu_tap_upload_photo' | 'menu_change_photo' | 'menu_photo_badge_new'
  // ── Restaurant ────────────────────────────────────────────────────────────
  | 'restaurant_title' | 'restaurant_status_card' | 'restaurant_photos_card'
  | 'restaurant_cover_photo' | 'restaurant_logo_label' | 'restaurant_add_gallery'
  | 'restaurant_upload_cover' | 'restaurant_upload_logo'
  | 'restaurant_profile_card' | 'restaurant_name_label' | 'restaurant_address_label'
  | 'restaurant_phone_label' | 'restaurant_description_label' | 'restaurant_edit_description'
  | 'restaurant_opening_hours_card' | 'restaurant_day_col' | 'restaurant_opens_col'
  | 'restaurant_closes_col' | 'restaurant_open_col' | 'restaurant_closed_label'
  | 'restaurant_not_set' | 'restaurant_min_order_card' | 'restaurant_min_order_placeholder'
  | 'restaurant_customer_reviews' | 'restaurant_contact_support'
  | 'restaurant_request_change' | 'restaurant_change_name_address' | 'restaurant_request_submitted'
  | 'restaurant_new_name_label' | 'restaurant_new_address_label'
  | 'restaurant_use_same_docs' | 'restaurant_copying' | 'restaurant_or_upload_new'
  | 'restaurant_setup_title' | 'restaurant_description_placeholder' | 'restaurant_save_hours'
  | 'restaurant_kyc_note' | 'restaurant_modal_form_note' | 'restaurant_next_upload_docs'
  | 'restaurant_creating' | 'restaurant_modal_docs_note' | 'restaurant_doc_ready'
  | 'restaurant_submit_review' | 'restaurant_submitting' | 'restaurant_submitted_note'
  | 'common_replace'
  // ── KYC Steps ─────────────────────────────────────────────────────────────
  | 'kyc_step1_title' | 'kyc_step1_business_name' | 'kyc_step1_business_type'
  | 'kyc_step1_business_address' | 'kyc_step1_business_phone' | 'kyc_step1_continue'
  | 'kyc_step1_phone_error'
  | 'kyc_step2_title' | 'kyc_step2_subtitle' | 'kyc_step2_submit' | 'kyc_step2_reupload'
  | 'kyc_doc_national_id_desc' | 'kyc_doc_business_reg_desc'
  | 'kyc_doc_bank_book_desc' | 'kyc_doc_storefront_desc'
  | 'kyc_step3_title' | 'kyc_step3_body' | 'kyc_step3_info'
  // ── KYC Pending ───────────────────────────────────────────────────────────
  | 'kyc_pending_title' | 'kyc_pending_submitted' | 'kyc_pending_review_note'
  | 'kyc_pending_rejection_title' | 'kyc_pending_rejection_help'
  | 'kyc_pending_resubmit' | 'kyc_pending_contact_support'
  // ── KYC ───────────────────────────────────────────────────────────────────
  | 'kyc_log_out'
  | 'kyc_doc_national_id' | 'kyc_doc_business_reg' | 'kyc_doc_bank_book' | 'kyc_doc_storefront'
  // ── OTP Login ─────────────────────────────────────────────────────────────
  | 'otp_phone_label' | 'otp_send_code' | 'otp_code_sent_to'
  | 'otp_verify_sign_in' | 'otp_phone_login_title' | 'otp_enter_otp_title'
  | 'otp_send_pin_subtitle' | 'otp_check_messages' | 'otp_sent_one_time_pin'
  | 'otp_enter_phone_tagline' | 'otp_enter_digit_code'
  // ── Register ──────────────────────────────────────────────────────────────
  | 'register_full_name' | 'register_email_address' | 'register_password'
  | 'register_password_hint' | 'register_send_code' | 'register_note'
  | 'register_verify_create' | 'register_edit_details' | 'register_resend_code'
  | 'register_verify_email_title' | 'register_create_account_title' | 'register_create_subtitle'
  // ── Business Profile ──────────────────────────────────────────────────────
  | 'biz_title' | 'biz_email_not_verified' | 'biz_tap_to_verify'
  | 'biz_account' | 'biz_unverified' | 'biz_verified'
  | 'biz_add_email' | 'biz_verify_email_password' | 'biz_verification_docs' | 'biz_failed_load'
  // ── Cashout / Invoice ─────────────────────────────────────────────────────
  | 'cashout_eyebrow' | 'cashout_title'
  | 'cashout_period_today' | 'cashout_period_week' | 'cashout_period_month'
  | 'cashout_section_today' | 'cashout_section_history'
  | 'cashout_qr_upload' | 'cashout_qr_replace' | 'cashout_qr_uploading' | 'cashout_qr_saved'
  | 'cashout_load_more' | 'cashout_no_invoices' | 'cashout_no_week' | 'cashout_no_month'
  | 'cashout_orders' | 'cashout_customer_total' | 'cashout_platform_fee' | 'cashout_payout';

type Translations = Record<TranslationKey, string>;

const EN: Translations = {
  // Common
  common_save: 'Save',
  common_cancel: 'Cancel',
  common_back: 'Back',
  common_saving: 'Saving…',
  common_back_to_settings: 'Settings',
  common_done: 'Done',
  common_edit: 'Edit',
  common_delete: 'Delete',
  common_add: 'Add',
  common_change: 'Change',
  common_remove: 'Remove',
  common_upload: 'Upload',
  common_uploading: 'Uploading…',
  common_loading: 'Loading…',
  common_retry: 'Tap to retry',
  common_today: 'Today',
  common_yesterday: 'Yesterday',
  common_last_7_days: 'Last 7 Days',
  common_last_30_days: 'Last 30 Days',
  common_orders: 'orders',
  common_pending: 'pending',
  common_cancelled: 'cancelled',
  common_all: 'All',
  common_export_csv: 'Export CSV',
  common_go_back: '← Go back',
  common_search_customer_order: 'Search by customer or order #…',
  common_no_data_period: 'No data for this period',
  common_min: 'min',
  common_optional: 'optional',
  // Settings
  settings_title: 'Settings',
  settings_preferences: 'Preferences',
  settings_account: 'Account',
  settings_restaurant: 'Restaurant',
  settings_language: 'Language',
  settings_language_en: 'English',
  settings_language_my: 'Myanmar (Burmese)',
  settings_theme: 'Theme',
  settings_theme_light: 'Light',
  settings_theme_dark: 'Dark',
  settings_menu_view: 'Menu View',
  settings_menu_view_list: 'List',
  settings_menu_view_grid: 'Grid',
  settings_change_password: 'Change Password',
  settings_operating_hours: 'Operating Hours',
  // Change Password
  change_password_title: 'Change Password',
  change_password_current: 'Current Password',
  change_password_new: 'New Password',
  change_password_confirm: 'Confirm New Password',
  change_password_success: 'Password changed successfully.',
  change_password_hint: 'Must be at least 8 characters.',
  // Operating Hours
  hours_title: 'Operating Hours',
  hours_day_sun: 'Sun',
  hours_day_mon: 'Mon',
  hours_day_tue: 'Tue',
  hours_day_wed: 'Wed',
  hours_day_thu: 'Thu',
  hours_day_fri: 'Fri',
  hours_day_sat: 'Sat',
  hours_opens: 'Opens',
  hours_closes: 'Closes',
  hours_open: 'Open',
  hours_closed: 'Closed',
  hours_not_set: 'Not set',
  hours_session: 'Session',
  hours_add_session: '+ Add session',
  hours_edit_session_menu: 'Edit Session Menu',
  hours_session_menu_count: 'categories',
  // Dashboard
  dashboard_title: 'Dashboard',
  dashboard_greeting_morning: 'Good Morning',
  dashboard_greeting_afternoon: 'Good Afternoon',
  dashboard_greeting_evening: 'Good Evening',
  dashboard_today_revenue: "TODAY'S REVENUE",
  dashboard_this_week: 'THIS WEEK',
  dashboard_this_month: 'THIS MONTH',
  dashboard_performance: 'Performance',
  dashboard_top_sales: 'Top Sales',
  dashboard_top_customers: 'Top Customers',
  dashboard_pending_orders: 'PENDING ORDERS',
  dashboard_recent_orders: 'RECENT ORDERS',
  dashboard_no_recent_orders: 'No recent orders',
  dashboard_quick_stats: 'QUICK STATS',
  dashboard_total_orders_month: 'Total Orders (Month)',
  dashboard_avg_order_value: 'Avg. Order Value',
  dashboard_activity: 'ACTIVITY',
  dashboard_no_recent_activity: 'No recent activity',
  dashboard_new_order_from: 'New order from',
  dashboard_sold: 'sold',
  dashboard_no_data_period: 'No data for this period',
  dashboard_period_today: 'Today',
  dashboard_period_week: 'This Week',
  dashboard_period_month: 'This Month',
  dashboard_orders_count: 'orders today',
  dashboard_pending_count: 'pending',
  // Orders
  orders_title: 'Orders',
  orders_all: 'All Orders',
  orders_new: 'New',
  orders_in_progress: 'In Progress',
  orders_done: 'Done',
  orders_cancelled_orders: 'Cancelled Orders',
  orders_search_placeholder: 'Search by customer or order #…',
  orders_count: 'orders',
  orders_no_orders_found: 'No orders found',
  orders_no_orders_body_search: 'Try a different search term',
  orders_no_orders_body_filter: 'Try a different filter or date',
  orders_section_new: 'New Orders',
  orders_section_in_progress: 'In Progress',
  orders_section_done: 'Completed',
  orders_back_to_today: 'Today',
  orders_pending_count: 'pending',
  // Order Card
  card_accept_order: 'Accept Order',
  card_start_preparing: 'Start Preparing',
  prep_time_modal_title: 'How long will it take?',
  prep_time_modal_subtitle: 'Customer will see this estimated time.',
  prep_time_modal_confirm: 'Start Preparing',
  card_mark_ready: 'Mark Ready',
  card_rider_picked_up: 'Rider Picked Up',
  card_mark_delivered: 'Mark Delivered',
  card_complete_order: 'Complete Order',
  // Order Detail
  order_detail_cannot_load: 'Order could not be loaded',
  order_detail_go_back: '← Go back',
  order_detail_customer: 'Customer',
  order_detail_name: 'Name',
  order_detail_phone: 'Phone',
  order_detail_contact: 'Order Contact',
  order_detail_address: 'Address',
  order_detail_notes: 'Notes',
  order_detail_order_details: 'Order Details',
  order_detail_order_num: 'Order #',
  order_detail_payment: 'Payment',
  order_detail_placed: 'Placed',
  order_detail_prep_time: 'Prep Time',
  order_detail_items: 'Items',
  order_detail_subtotal: 'Subtotal',
  order_detail_total: 'Total',
  order_detail_waiting_payment_note: 'Waiting for customer to complete payment.',
  order_detail_chat_customer: 'Chat with Customer',
  order_detail_how_long: 'How long will this order take?',
  order_detail_updating: 'Updating…',
  order_detail_cancel_order: 'Cancel Order',
  order_detail_cancel_title: 'Cancel Order',
  order_detail_reason: 'Reason',
  order_detail_additional_details: 'Additional Details (optional)',
  order_detail_details_placeholder: 'Describe the reason in more detail…',
  order_detail_keep_order: 'Keep Order',
  order_detail_confirm_cancel: 'Confirm Cancel',
  order_detail_cancel_closing: 'Closing soon',
  order_detail_cancel_sold_out: 'Sold out',
  order_detail_cancel_out_of_range: 'Delivery address out of range',
  action_accept: 'Accept Order',
  action_start_preparing: 'Start Preparing',
  action_mark_ready_pickup: 'Mark Ready for Pickup / Delivery',
  action_rider_picked_up: 'Mark Picked Up by Rider',
  action_mark_delivered: 'Mark Delivered',
  action_complete: 'Complete Order',
  payment_cod: 'Cash on Delivery',
  payment_prompt_pay: 'PromptPay',
  payment_line_pay: 'LINE Pay',
  // Cancelled Orders
  cancelled_title: 'Cancelled Orders',
  cancelled_no_orders: 'No cancelled orders',
  cancelled_no_orders_search: 'Try a different search term',
  cancelled_no_orders_period: 'No orders were cancelled in this period',
  cancelled_section_label: 'Cancelled',
  // Analytics
  analytics_all: 'All',
  analytics_today: 'Today',
  analytics_week: 'Week',
  analytics_month: 'Month',
  analytics_revenue: 'Revenue',
  analytics_pending_now: 'Pending Now',
  analytics_need_attention: 'need attention',
  analytics_week_revenue: 'Week Revenue',
  analytics_month_revenue: 'Month Revenue',
  analytics_avg_order_value: 'Avg Order Value',
  analytics_this_month: 'this month',
  analytics_performance_eyebrow: 'PERFORMANCE',
  analytics_page_title: 'Analytics',
  analytics_pending_suffix: 'pending',
  analytics_chart_revenue: 'Revenue',
  analytics_chart_orders: 'Order Volume',
  analytics_chart_sub_today_week_month: 'Today / Week / Month',
  analytics_no_revenue: 'No revenue data yet',
  analytics_no_orders: 'No orders yet',
  analytics_chart_hourly: 'Hourly Breakdown',
  analytics_chart_daily_7: 'Daily – Last 7 Days',
  analytics_chart_daily_30: 'Daily – Last 30 Days',
  analytics_no_period_data: 'No data for this period yet',
  analytics_comparison_title: 'Period Comparison',
  analytics_col_period: 'Period',
  analytics_col_revenue: 'Revenue',
  analytics_col_orders: 'Orders',
  // Notifications
  notif_title: 'Notifications',
  notif_inbox: 'INBOX',
  notif_mark_all_read: 'Mark all read',
  notif_failed_load: 'Failed to load notifications',
  notif_retry: 'Tap to retry',
  notif_no_notifications: 'No notifications yet',
  notif_subtitle: 'New orders and updates will appear here.',
  // Profile
  profile_cover_hint: 'Tap to add cover photo',
  profile_your_restaurant: 'Your Restaurant',
  profile_account: 'Account',
  profile_name: 'Name',
  profile_email: 'Email',
  profile_phone: 'Phone',
  profile_business: 'Business',
  profile_business_profile: 'Business Profile',
  profile_settings: 'Settings',
  profile_sign_out: 'Sign Out',
  // Chat
  chat_title: 'Chat with Customer',
  chat_no_messages: 'No messages.',
  chat_check_internet: 'Please check your internet connection.',
  chat_cannot_load: 'Could not load messages.',
  chat_type_message: 'Type a message…',
  chat_locked: 'Chat has closed. Messages are deleted 3 hours after order completion.',
  chat_will_close: 'Chat will close 3 hours after order completion.',
  chat_add_photo: 'Add photo',
  chat_notice_banner: 'Chat will disappear 3 hours after order complete. Do not share sensitive info. Admin are watching!',
  chat_reply_to: 'Reply to',
  chat_cancel_reply: 'Cancel reply',
  chat_photo: 'Photo',
  // Reviews
  reviews_title: 'Reviews',
  reviews_total: 'total',
  reviews_loading: 'Loading…',
  reviews_cannot_load: 'Could not load reviews',
  reviews_no_reviews: 'No reviews yet',
  reviews_no_reviews_body: 'Completed orders with ratings will appear here',
  // Login
  login_email_label: 'EMAIL ADDRESS',
  login_email_placeholder: 'you@email.com',
  login_password_label: 'PASSWORD',
  login_sign_in: 'Sign In',
  login_signing_in: 'Signing in…',
  login_show_password: 'Show password',
  login_hide_password: 'Hide password',
  login_or_continue: 'or continue with',
  login_phone_instead: 'Login with Phone',
  login_no_account: "Don't have an account?",
  login_register: 'Register',
  // Menu
  menu_title: 'Menu',
  menu_add_category: 'Add Category',
  menu_search_placeholder: 'Search items…',
  menu_all_category: 'All',
  menu_no_items_search: 'No items match your search',
  menu_no_items_empty: 'No items yet',
  menu_no_items_keyword: 'Try a different keyword',
  menu_no_items_empty_hint: 'Select a category below and add your first item',
  menu_system_warn: 'Menu hidden from customers — Popular Picks & Recommendations each need at least 1 item.',
  menu_add_item: 'Add Item',
  menu_new_category_title: 'New Category',
  menu_rename_category_title: 'Rename Category',
  menu_delete_category_title: 'Delete Category',
  menu_category_name_placeholder: 'Category name',
  menu_new_item_title: 'New Menu Item',
  menu_edit_item_title: 'Edit Menu Item',
  menu_save_changes: 'Save Changes',
  menu_item_name_placeholder: 'Item name *',
  menu_item_desc_placeholder: 'Description (optional)',
  menu_price_label: 'Price *',
  menu_original_price_label: 'Original Price (before discount)',
  menu_options_title: 'Options / Modifiers',
  menu_add_group: 'Add Group',
  menu_required: 'Required',
  menu_min: 'Min',
  menu_max: 'Max',
  menu_group_name_placeholder: 'Group name (e.g. Protein)',
  menu_option_name_placeholder: 'Option name',
  menu_add_option: 'Add Option',
  menu_tap_upload_photo: 'Tap to upload photo',
  menu_change_photo: 'Change Photo',
  menu_photo_badge_new: 'New',
  // Restaurant
  restaurant_title: 'Restaurant',
  restaurant_status_card: 'Status',
  restaurant_photos_card: 'Photos',
  restaurant_cover_photo: 'Cover Photo',
  restaurant_logo_label: 'Logo',
  restaurant_add_gallery: 'Add Gallery Photo',
  restaurant_upload_cover: 'Upload Cover Photo',
  restaurant_upload_logo: 'Upload Logo',
  restaurant_profile_card: 'Profile',
  restaurant_name_label: 'Name',
  restaurant_address_label: 'Address',
  restaurant_phone_label: 'Phone',
  restaurant_description_label: 'Description',
  restaurant_edit_description: 'Edit Description',
  restaurant_opening_hours_card: 'Opening Hours',
  restaurant_day_col: 'Day',
  restaurant_opens_col: 'Opens',
  restaurant_closes_col: 'Closes',
  restaurant_open_col: 'Open',
  restaurant_closed_label: 'Closed',
  restaurant_not_set: 'Not set',
  restaurant_min_order_card: 'Min Order',
  restaurant_min_order_placeholder: 'e.g. 100',
  restaurant_customer_reviews: 'Customer Reviews',
  restaurant_contact_support: 'Contact Support (LINE)',
  restaurant_request_change: 'Request change →',
  restaurant_change_name_address: 'Change Name / Address',
  restaurant_request_submitted: 'Request Submitted',
  restaurant_new_name_label: 'New Restaurant Name',
  restaurant_new_address_label: 'New Address',
  restaurant_use_same_docs: 'Use same documents as original KYC',
  restaurant_copying: 'Copying…',
  restaurant_or_upload_new: 'OR UPLOAD NEW',
  restaurant_setup_title: 'Setup Restaurant',
  restaurant_description_placeholder: 'Tell customers about your restaurant',
  restaurant_save_hours: 'Save Hours',
  restaurant_kyc_note: 'Name and address can only be changed via KYC resubmission.',
  restaurant_modal_form_note: 'Enter your new restaurant name and address. An admin will verify and approve the change.',
  restaurant_next_upload_docs: 'Next → Upload Documents',
  restaurant_creating: 'Creating…',
  restaurant_modal_docs_note: 'Verify your identity to approve this change. Use your existing documents or upload new ones.',
  restaurant_doc_ready: '✓ Ready',
  restaurant_submit_review: 'Submit for Review',
  restaurant_submitting: 'Submitting…',
  restaurant_submitted_note: 'Your request has been submitted. An admin will review and approve or reject the change. You will be notified of the outcome.',
  common_replace: 'Replace',
  // KYC Steps
  kyc_step1_title: 'Business Information',
  kyc_step1_business_name: 'Business Name',
  kyc_step1_business_type: 'Business Type',
  kyc_step1_business_address: 'Business Address',
  kyc_step1_business_phone: 'Business Phone',
  kyc_step1_continue: 'Continue',
  kyc_step1_phone_error: 'Phone number must be exactly 10 digits',
  kyc_step2_title: 'Required Documents',
  kyc_step2_subtitle: 'Upload all four documents to continue',
  kyc_step2_submit: 'Submit Application',
  kyc_step2_reupload: 'Re-upload',
  kyc_doc_national_id_desc: 'Front and back of your national ID card',
  kyc_doc_business_reg_desc: 'Certificate of business registration',
  kyc_doc_bank_book_desc: 'First page of your bank account book',
  kyc_doc_storefront_desc: 'A clear photo of your restaurant exterior',
  kyc_step3_title: 'Application Submitted!',
  kyc_step3_body: 'Your application is under review. We will notify you within 1–2 business days once the verification is complete.',
  kyc_step3_info: 'You will receive an email notification when your account is approved.',
  // KYC Pending
  kyc_pending_title: 'Application Status',
  kyc_pending_submitted: 'Submitted:',
  kyc_pending_review_note: 'Your application is under review. Our team will get back to you within 1–2 business days.',
  kyc_pending_rejection_title: 'Reason for rejection:',
  kyc_pending_rejection_help: 'You can correct the issues and resubmit, or contact our support team for assistance.',
  kyc_pending_resubmit: 'Resubmit Application',
  kyc_pending_contact_support: 'Contact Support',
  // KYC
  kyc_log_out: 'Log Out',
  kyc_doc_national_id: 'National ID',
  kyc_doc_business_reg: 'Business Registration',
  kyc_doc_bank_book: 'Bank Book',
  kyc_doc_storefront: 'Storefront Photo',
  // OTP Login
  otp_phone_label: 'PHONE NUMBER',
  otp_send_code: 'Send OTP Code',
  otp_code_sent_to: 'Code sent to',
  otp_verify_sign_in: 'Verify & Sign In',
  otp_phone_login_title: 'Phone Login',
  otp_enter_otp_title: 'Enter your OTP',
  otp_send_pin_subtitle: 'We will send you a one-time PIN',
  otp_check_messages: 'Check your messages',
  otp_sent_one_time_pin: "We'll send a one-time PIN to your number",
  otp_enter_phone_tagline: 'Enter your phone number to receive a login code',
  otp_enter_digit_code: '-digit code',
  // Register
  register_full_name: 'Full name',
  register_email_address: 'Email address',
  register_password: 'Password',
  register_password_hint: 'Min 8 characters · uppercase · lowercase · number',
  register_send_code: 'Send Verification Code',
  register_note: 'After registration you will complete KYC verification before your store goes live.',
  register_verify_create: 'Verify & Create Account',
  register_edit_details: '← Edit details',
  register_resend_code: 'Resend code',
  register_verify_email_title: 'Verify your email',
  register_create_account_title: 'Create your account',
  register_create_subtitle: 'Register to start selling with MOi Order',
  // Business Profile
  biz_title: 'Business Profile',
  biz_email_not_verified: 'Email not verified',
  biz_tap_to_verify: 'Tap to verify your email and set your own password.',
  biz_account: 'Account',
  biz_unverified: 'Unverified',
  biz_verified: 'Verified',
  biz_add_email: 'Add email address',
  biz_verify_email_password: 'Verify Email & Set Password',
  biz_verification_docs: 'Verification Documents',
  biz_failed_load: 'Failed to load profile.',
  // Cashout / Invoice
  cashout_eyebrow: 'CASHOUT',
  cashout_title: 'Daily Invoice',
  cashout_period_today: 'Today',
  cashout_period_week: 'This Week',
  cashout_period_month: 'This Month',
  cashout_section_today: 'TODAY',
  cashout_section_history: 'HISTORY',
  cashout_qr_upload: 'Upload QR',
  cashout_qr_replace: 'Replace QR',
  cashout_qr_uploading: 'Uploading…',
  cashout_qr_saved: '✓ QR Saved',
  cashout_load_more: 'Load more',
  cashout_no_invoices: 'No past invoices yet.',
  cashout_no_week: 'No data for this week yet.',
  cashout_no_month: 'No data for this month yet.',
  cashout_orders: 'Orders',
  cashout_customer_total: 'Customer Total',
  cashout_platform_fee: 'Platform Fee (5%)',
  cashout_payout: 'Your Payout',
} as const;

const MY: Translations = {
  // Common
  common_save: 'သိမ်းရန်',
  common_cancel: 'ပယ်ဖျက်',
  common_back: 'နောက်သို့',
  common_saving: 'သိမ်းနေသည်…',
  common_back_to_settings: 'ဆက်တင်',
  common_done: 'ပြီးပြည့်စုံ',
  common_edit: 'တည်းဖြတ်',
  common_delete: 'ဖျက်ရန်',
  common_add: 'ထည့်ရန်',
  common_change: 'ပြောင်းရန်',
  common_remove: 'ဖယ်ရှားရန်',
  common_upload: 'တင်ရန်',
  common_uploading: 'တင်နေသည်…',
  common_loading: 'ဖတ်နေသည်…',
  common_retry: 'နှိပ်ပြီး ထပ်ကြိုးစားပါ',
  common_today: 'ယနေ့',
  common_yesterday: 'မနေ့က',
  common_last_7_days: 'ပြီးခဲ့သော ၇ ရက်',
  common_last_30_days: 'ပြီးခဲ့သော ၃၀ ရက်',
  common_orders: 'မှာယူမှု',
  common_pending: 'ဆောင်ရွက်ရန်ကျန်',
  common_cancelled: 'ပယ်ဖျက်',
  common_all: 'အားလုံး',
  common_export_csv: 'CSV ထုတ်ရန်',
  common_go_back: '← နောက်သို့',
  common_search_customer_order: 'ဝယ်သူ သို့မဟုတ် အော်ဒါ # ဖြင့် ရှာရန်…',
  common_no_data_period: 'ဤကာလအတွက် ဒေတာ မရှိပါ',
  common_min: 'မိနစ်',
  common_optional: 'ရွေးချယ်နိုင်',
  // Settings
  settings_title: 'ဆက်တင်များ',
  settings_preferences: 'နှစ်သက်မှုများ',
  settings_account: 'အကောင့်',
  settings_restaurant: 'စားသောက်ဆိုင်',
  settings_language: 'ဘာသာစကား',
  settings_language_en: 'English',
  settings_language_my: 'မြန်မာ',
  settings_theme: 'အပြင်အဆင်',
  settings_theme_light: 'အလင်း',
  settings_theme_dark: 'အမှောင်',
  settings_menu_view: 'မီနူးပြသမှု',
  settings_menu_view_list: 'စာရင်း',
  settings_menu_view_grid: 'ဂရစ်',
  settings_change_password: 'စကားဝှက်ပြောင်းရန်',
  settings_operating_hours: 'ဖွင့်ချိန်',
  // Change Password
  change_password_title: 'စကားဝှက်ပြောင်းရန်',
  change_password_current: 'လက်ရှိစကားဝှက်',
  change_password_new: 'စကားဝှက်အသစ်',
  change_password_confirm: 'စကားဝှက်အသစ် အတည်ပြု',
  change_password_success: 'စကားဝှက် အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ။',
  change_password_hint: 'အနည်းဆုံး ၈ လုံး ရှိရမည်။',
  // Operating Hours
  hours_title: 'ဖွင့်ချိန်',
  hours_day_sun: 'နွေ',
  hours_day_mon: 'လာ',
  hours_day_tue: 'ဂါ',
  hours_day_wed: 'ဟူး',
  hours_day_thu: 'တေး',
  hours_day_fri: 'ကြာ',
  hours_day_sat: 'နေ',
  hours_opens: 'ဖွင့်',
  hours_closes: 'ပိတ်',
  hours_open: 'ဖွင့်',
  hours_closed: 'ပိတ်',
  hours_not_set: 'မသတ်မှတ်ရသေး',
  hours_session: 'အချိန်ကာလ',
  hours_add_session: '+ အချိန်ကာလ ထပ်ထည့်',
  hours_edit_session_menu: 'Session Menu တည်းဖြတ်ရန်',
  hours_session_menu_count: 'အမျိုးအစားများ',
  // Dashboard
  dashboard_title: 'ဒက်ရှ်ဘုတ်',
  dashboard_greeting_morning: 'မင်္ဂလာနံနက်ခင်းပါ',
  dashboard_greeting_afternoon: 'မင်္ဂလာနေ့လည်ပိုင်းပါ',
  dashboard_greeting_evening: 'မင်္ဂလာညနေပိုင်းပါ',
  dashboard_today_revenue: 'ယနေ့ ဝင်ငွေ',
  dashboard_this_week: 'ဤသတ်ပတ်',
  dashboard_this_month: 'ဤလ',
  dashboard_performance: 'စွမ်းဆောင်ရည်',
  dashboard_top_sales: 'ရောင်းအကောင်းဆုံး',
  dashboard_top_customers: 'ထိပ်တန်း ဝယ်သူများ',
  dashboard_pending_orders: 'ဆောင်ရွက်ရန် အော်ဒါများ',
  dashboard_recent_orders: 'မကြာသေးမီ အော်ဒါများ',
  dashboard_no_recent_orders: 'မကြာသေးမီ အော်ဒါ မရှိပါ',
  dashboard_quick_stats: 'အကြမ်းဖျင်း စာရင်း',
  dashboard_total_orders_month: 'စုစုပေါင်း အော်ဒါ (လ)',
  dashboard_avg_order_value: 'ပျမ်းမျှ အော်ဒါတန်ဖိုး',
  dashboard_activity: 'လှုပ်ရှားမှု',
  dashboard_no_recent_activity: 'မကြာသေးမီ လှုပ်ရှားမှု မရှိပါ',
  dashboard_new_order_from: 'မှ အော်ဒါသစ်',
  dashboard_sold: 'ရောင်းချပြီး',
  dashboard_no_data_period: 'ဤကာလအတွက် ဒေတာ မရှိပါ',
  dashboard_period_today: 'ယနေ့',
  dashboard_period_week: 'ဤသတ်ပတ်',
  dashboard_period_month: 'ဤလ',
  dashboard_orders_count: 'ယနေ့ အော်ဒါ',
  dashboard_pending_count: 'ဆောင်ရွက်ရန်ကျန်',
  // Orders
  orders_title: 'အော်ဒါများ',
  orders_all: 'အော်ဒါအားလုံး',
  orders_new: 'အသစ်',
  orders_in_progress: 'ဆောင်ရွက်ဆဲ',
  orders_done: 'ပြီးဆုံး',
  orders_cancelled_orders: 'ပယ်ဖျက်ထားသော အော်ဒါများ',
  orders_search_placeholder: 'ဝယ်သူ သို့မဟုတ် အော်ဒါ # ဖြင့် ရှာရန်…',
  orders_count: 'မှာယူမှု',
  orders_no_orders_found: 'အော်ဒါ မတွေ့ပါ',
  orders_no_orders_body_search: 'ရှာဖွေရေး အသုံးအနှုန်း အခြားတစ်ခု ကြိုးစားပါ',
  orders_no_orders_body_filter: 'စစ်ထုတ်မှု သို့မဟုတ် ရက်စွဲ ပြောင်းပြီး ကြိုးစားပါ',
  orders_section_new: 'အော်ဒါသစ်များ',
  orders_section_in_progress: 'ဆောင်ရွက်ဆဲ',
  orders_section_done: 'ပြီးဆုံး',
  orders_back_to_today: 'ယနေ့',
  orders_pending_count: 'ဆောင်ရွက်ရန်ကျန်',
  // Order Card
  card_accept_order: 'အော်ဒါ လက်ခံ',
  card_start_preparing: 'ချက်ပြုတ်ရန် စတင်',
  prep_time_modal_title: 'အချိန်မည်မျှ ကြာမည်နည်း?',
  prep_time_modal_subtitle: 'ဖောက်သည်သည် ခန့်မှန်းချိန်ကို မြင်ရမည်။',
  prep_time_modal_confirm: 'ချက်ပြုတ်ရန် စတင်',
  card_mark_ready: 'အဆင်သင့် မှတ်',
  card_rider_picked_up: 'ရိုက်ဒါ ယူပြီ',
  card_mark_delivered: 'ပို့ဆောင်ပြီ မှတ်',
  card_complete_order: 'အော်ဒါ ပြီးဆုံး',
  // Order Detail
  order_detail_cannot_load: 'အော်ဒါ ဖတ်မရပါ',
  order_detail_go_back: '← နောက်သို့',
  order_detail_customer: 'ဝယ်သူ',
  order_detail_name: 'နာမည်',
  order_detail_phone: 'ဖုန်းနံပါတ်',
  order_detail_contact: 'အော်ဒါ ဆက်သွယ်ရန်',
  order_detail_address: 'လိပ်စာ',
  order_detail_notes: 'မှတ်ချက်',
  order_detail_order_details: 'အော်ဒါ အသေးစိတ်',
  order_detail_order_num: 'အော်ဒါ #',
  order_detail_payment: 'ငွေပေးချေမှု',
  order_detail_placed: 'မှာယူသည့်ရက်',
  order_detail_prep_time: 'ပြင်ဆင်ချိန်',
  order_detail_items: 'ပစ္စည်းများ',
  order_detail_subtotal: 'ကြိုတင်ပေး',
  order_detail_total: 'စုစုပေါင်း',
  order_detail_waiting_payment_note: 'ဝယ်သူ ငွေပေးချေရန် စောင့်ဆိုင်းနေသည်။',
  order_detail_chat_customer: 'ဝယ်သူနှင့် ချတ်',
  order_detail_how_long: 'ဤအော်ဒါ အချိန်မည်မျှ ကြာမည်နည်း?',
  order_detail_updating: 'အပ်ဒိတ်လုပ်နေသည်…',
  order_detail_cancel_order: 'အော်ဒါ ပယ်ဖျက်ရန်',
  order_detail_cancel_title: 'အော်ဒါ ပယ်ဖျက်ရန်',
  order_detail_reason: 'အကြောင်းပြချက်',
  order_detail_additional_details: 'နောက်ထပ် အသေးစိတ် (ရွေးချယ်နိုင်)',
  order_detail_details_placeholder: 'အကြောင်းပြချက် ပိုမိုအသေးစိတ် ဖော်ပြပါ…',
  order_detail_keep_order: 'အော်ဒါ ဆက်ထိန်းရန်',
  order_detail_confirm_cancel: 'ပယ်ဖျက်ကြောင်း အတည်ပြုရန်',
  order_detail_cancel_closing: 'မကြာမီ ပိတ်မည်',
  order_detail_cancel_sold_out: 'ပစ္စည်း ကုန်ဆုံး',
  order_detail_cancel_out_of_range: 'ပို့ဆောင်ရေး လိပ်စာ အကွာအဝေး လွန်',
  action_accept: 'အော်ဒါ လက်ခံ',
  action_start_preparing: 'ချက်ပြုတ်ရန် စတင်',
  action_mark_ready_pickup: 'ယူဆောင်/ပို့ဆောင်ရန် အဆင်သင့် မှတ်ပါ',
  action_rider_picked_up: 'ရိုက်ဒါ ယူဆောင်ပြီ မှတ်ပါ',
  action_mark_delivered: 'ပို့ဆောင်ပြီ မှတ်ပါ',
  action_complete: 'အော်ဒါ ပြီးဆုံး',
  payment_cod: 'ငွေသားဖြင့် ပေးချေ',
  payment_prompt_pay: 'PromptPay',
  payment_line_pay: 'LINE Pay',
  // Cancelled Orders
  cancelled_title: 'ပယ်ဖျက်ထားသော အော်ဒါများ',
  cancelled_no_orders: 'ပယ်ဖျက်ထားသော အော်ဒါ မရှိပါ',
  cancelled_no_orders_search: 'ရှာဖွေရေး အသုံးအနှုန်း အခြားတစ်ခု ကြိုးစားပါ',
  cancelled_no_orders_period: 'ဤကာလတွင် ပယ်ဖျက်ထားသော အော်ဒါ မရှိပါ',
  cancelled_section_label: 'ပယ်ဖျက်',
  // Analytics
  analytics_all: 'အားလုံး',
  analytics_today: 'ယနေ့',
  analytics_week: 'ဤသတ်ပတ်',
  analytics_month: 'ဤလ',
  analytics_revenue: 'ဝင်ငွေ',
  analytics_pending_now: 'ဆောင်ရွက်ရန်ကျန်',
  analytics_need_attention: 'အာရုံစိုက်ရန် လိုသည်',
  analytics_week_revenue: 'သတ်ပတ် ဝင်ငွေ',
  analytics_month_revenue: 'လ ဝင်ငွေ',
  analytics_avg_order_value: 'ပျမ်းမျှ အော်ဒါတန်ဖိုး',
  analytics_this_month: 'ဤလ',
  analytics_performance_eyebrow: 'စွမ်းဆောင်ရည်',
  analytics_page_title: 'အနုဆန်းစစ်',
  analytics_pending_suffix: 'ဆိုင်းငံ့နေ',
  analytics_chart_revenue: 'ဝင်ငွေ',
  analytics_chart_orders: 'အော်ဒါ ပမာဏ',
  analytics_chart_sub_today_week_month: 'ယနေ့ / သတ်ပတ် / လ',
  analytics_no_revenue: 'ဝင်ငွေ ဒေတာ မရှိသေးပါ',
  analytics_no_orders: 'အော်ဒါ မရှိသေးပါ',
  analytics_chart_hourly: 'နာရီအလိုက် ပြသချက်',
  analytics_chart_daily_7: 'နေ့အလိုက် – ၇ ရက်',
  analytics_chart_daily_30: 'နေ့အလိုက် – ၃၀ ရက်',
  analytics_no_period_data: 'ဤကာလအတွက် ဒေတာ မရှိသေးပါ',
  analytics_comparison_title: 'ကာလ နှိုင်းယှဉ်ချက်',
  analytics_col_period: 'ကာလ',
  analytics_col_revenue: 'ဝင်ငွေ',
  analytics_col_orders: 'အော်ဒါများ',
  // Notifications
  notif_title: 'အကြောင်းကြားချက်များ',
  notif_inbox: 'ကြိုဆိုချက်',
  notif_mark_all_read: 'အားလုံး ဖတ်ပြီးဟု မှတ်',
  notif_failed_load: 'အကြောင်းကြားချက် ဖတ်မရပါ',
  notif_retry: 'နှိပ်ပြီး ထပ်ကြိုးစားပါ',
  notif_no_notifications: 'အကြောင်းကြားချက် မရှိသေးပါ',
  notif_subtitle: 'အော်ဒါသစ်နှင့် အပ်ဒိတ်များ ဤနေရာတွင် ပေါ်လာမည်။',
  // Profile
  profile_cover_hint: 'နှိပ်ပြီး ဖုံးဓာတ်ပုံ ထည့်ရန်',
  profile_your_restaurant: 'သင့်စားသောက်ဆိုင်',
  profile_account: 'အကောင့်',
  profile_name: 'နာမည်',
  profile_email: 'အီးမေးလ်',
  profile_phone: 'ဖုန်းနံပါတ်',
  profile_business: 'စီးပွားရေး',
  profile_business_profile: 'စီးပွားရေး ပရိုဖိုင်',
  profile_settings: 'ဆက်တင်များ',
  profile_sign_out: 'ထွက်ခြင်း',
  // Chat
  chat_title: 'ဝယ်သူနှင့် ချတ်',
  chat_no_messages: 'မက်ဆေ့ မရှိသေးပါ။',
  chat_check_internet: 'အင်တာနက် ချိတ်ဆက်မှု စစ်ဆေးပါ။',
  chat_cannot_load: 'မက်ဆေ့များ ဖတ်မရပါ။',
  chat_type_message: 'မက်ဆေ့ ရေးရန်…',
  chat_locked: 'ချတ် ပိတ်သွားပြီ။ မှာယူမှု ပြီးဆုံးပြီး ၃ နာရီ အကြာတွင် မက်ဆေ့များ ဖျက်မည်။',
  chat_will_close: 'မှာယူမှု ပြီးဆုံးပြီး ၃ နာရီ အကြာတွင် ချတ် ပိတ်မည်။',
  chat_add_photo: 'ဓာတ်ပုံ ထည့်ရန်',
  chat_notice_banner: 'ချတ်သည် မှာယူမှု ပြီးဆုံးပြီး ၃ နာရီ အကြာတွင် ပျောက်ကွယ်သွားမည်။ လျှို့ဝှက်သော အချက်အလက်များ မျှဝေခြင်း မပြုပါနှင့်။ Admin မှ ကြည့်ရှုနေသည်!',
  chat_reply_to: 'ပြန်ဆိုရန်',
  chat_cancel_reply: 'ပြန်ဆိုမှု ပယ်ဖျက်ရန်',
  chat_photo: 'ဓာတ်ပုံ',
  // Reviews
  reviews_title: 'သုံးသပ်ချက်များ',
  reviews_total: 'စုစုပေါင်း',
  reviews_loading: 'ဖတ်နေသည်…',
  reviews_cannot_load: 'သုံးသပ်ချက်များ ဖတ်မရပါ',
  reviews_no_reviews: 'သုံးသပ်ချက် မရှိသေးပါ',
  reviews_no_reviews_body: 'အဆင့်သတ်မှတ်ချက်ပါသော ပြီးဆုံးသော အော်ဒါများ ဤနေရာတွင် ပေါ်လာမည်',
  // Login
  login_email_label: 'အီးမေးလ် လိပ်စာ',
  login_email_placeholder: 'you@email.com',
  login_password_label: 'စကားဝှက်',
  login_sign_in: 'ဝင်ရောက်ရန်',
  login_signing_in: 'ဝင်ရောက်နေသည်…',
  login_show_password: 'စကားဝှက် ပြရန်',
  login_hide_password: 'စကားဝှက် ဖျောက်ရန်',
  login_or_continue: 'သို့မဟုတ် ဆက်လက်ရန်',
  login_phone_instead: 'ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ရန်',
  login_no_account: 'အကောင့် မရှိသေးဘူးလား?',
  login_register: 'မှတ်ပုံတင်ရန်',
  // Menu
  menu_title: 'မီနူး',
  menu_add_category: 'အမျိုးအစား ထည့်ရန်',
  menu_search_placeholder: 'ပစ္စည်းများ ရှာရန်…',
  menu_all_category: 'အားလုံး',
  menu_no_items_search: 'ရှာဖွေမှုနှင့် ကိုက်ညီသော ပစ္စည်း မရှိပါ',
  menu_no_items_empty: 'ပစ္စည်း မရှိသေးပါ',
  menu_no_items_keyword: 'ကီးဝေါ့ အခြားတစ်ခု ကြိုးစားပါ',
  menu_no_items_empty_hint: 'အောက်မှ အမျိုးအစား ရွေးပြီး ပထမဆုံး ပစ္စည်း ထည့်ပါ',
  menu_system_warn: 'မီနူး ဝယ်သူများမြင်ရမည့်နေရာ ဝှက်ထားသည် — Popular Picks နှင့် Recommendations တစ်ခုစီ ပစ္စည်းတစ်ခုပါ ထည့်ရမည်။',
  menu_add_item: 'ပစ္စည်း ထည့်ရန်',
  menu_new_category_title: 'အမျိုးအစားသစ်',
  menu_rename_category_title: 'အမျိုးအစား အမည်ပြောင်းရန်',
  menu_delete_category_title: 'အမျိုးအစား ဖျက်ရန်',
  menu_category_name_placeholder: 'အမျိုးအစား အမည်',
  menu_new_item_title: 'မီနူး ပစ္စည်းသစ်',
  menu_edit_item_title: 'မီနူး ပစ္စည်း တည်းဖြတ်ရန်',
  menu_save_changes: 'ပြောင်းလဲမှု သိမ်းရန်',
  menu_item_name_placeholder: 'ပစ္စည်း အမည် *',
  menu_item_desc_placeholder: 'ဖော်ပြချက် (ရွေးချယ်နိုင်)',
  menu_price_label: 'စျေးနှုန်း *',
  menu_original_price_label: 'မူလ စျေးနှုန်း (လျှော့ဈေးမတိုင်မီ)',
  menu_options_title: 'ရွေးချယ်မှုများ / မော်ဒိုင်ဖာ',
  menu_add_group: 'အုပ်စု ထည့်ရန်',
  menu_required: 'မဖြစ်မနေ',
  menu_min: 'အနည်းဆုံး',
  menu_max: 'အများဆုံး',
  menu_group_name_placeholder: 'အုပ်စု အမည် (ဥပမာ - ပရိုတင်း)',
  menu_option_name_placeholder: 'ရွေးချယ်မှု အမည်',
  menu_add_option: 'ရွေးချယ်မှု ထည့်ရန်',
  menu_tap_upload_photo: 'နှိပ်ပြီး ဓာတ်ပုံ တင်ရန်',
  menu_change_photo: 'ဓာတ်ပုံ ပြောင်းရန်',
  menu_photo_badge_new: 'အသစ်',
  // Restaurant
  restaurant_title: 'စားသောက်ဆိုင်',
  restaurant_status_card: 'အခြေအနေ',
  restaurant_photos_card: 'ဓာတ်ပုံများ',
  restaurant_cover_photo: 'ဖုံးဓာတ်ပုံ',
  restaurant_logo_label: 'လိုဂို',
  restaurant_add_gallery: 'ဓာတ်ပုံ မြင်ကွင်း ထည့်ရန်',
  restaurant_upload_cover: 'ဖုံးဓာတ်ပုံ တင်ရန်',
  restaurant_upload_logo: 'လိုဂို တင်ရန်',
  restaurant_profile_card: 'ပရိုဖိုင်',
  restaurant_name_label: 'နာမည်',
  restaurant_address_label: 'လိပ်စာ',
  restaurant_phone_label: 'ဖုန်းနံပါတ်',
  restaurant_description_label: 'ဖော်ပြချက်',
  restaurant_edit_description: 'ဖော်ပြချက် တည်းဖြတ်ရန်',
  restaurant_opening_hours_card: 'ဖွင့်ချိန်',
  restaurant_day_col: 'နေ့',
  restaurant_opens_col: 'ဖွင့်',
  restaurant_closes_col: 'ပိတ်',
  restaurant_open_col: 'ဖွင့်',
  restaurant_closed_label: 'ပိတ်',
  restaurant_not_set: 'မသတ်မှတ်ရသေး',
  restaurant_min_order_card: 'အနည်းဆုံး မှာယူမှု',
  restaurant_min_order_placeholder: 'ဥပမာ - ၁၀၀',
  restaurant_customer_reviews: 'ဝယ်သူ သုံးသပ်ချက်များ',
  restaurant_contact_support: 'ပံ့ပိုးမှု ဆက်သွယ်ရန် (LINE)',
  restaurant_request_change: 'ပြောင်းလဲမှု တောင်းဆိုရန် →',
  restaurant_change_name_address: 'နာမည် / လိပ်စာ ပြောင်းရန်',
  restaurant_request_submitted: 'တောင်းဆိုမှု တင်ပြပြီး',
  restaurant_new_name_label: 'ဆိုင်အမည်သစ်',
  restaurant_new_address_label: 'လိပ်စာသစ်',
  restaurant_use_same_docs: 'မူလ KYC စာရွက်စာတမ်းများ ထပ်သုံးရန်',
  restaurant_copying: 'ကူးနေသည်…',
  restaurant_or_upload_new: 'သို့မဟုတ် အသစ် တင်ရန်',
  restaurant_setup_title: 'စားသောက်ဆိုင် တည်ဆောက်ရန်',
  restaurant_description_placeholder: 'ဝယ်သူများကို သင့်ဆိုင်အကြောင်း ပြောပြပါ',
  restaurant_save_hours: 'ဖွင့်ချိန် သိမ်းရန်',
  restaurant_kyc_note: 'နာမည်နှင့် လိပ်စာကို KYC ပြန်တင်ပြမှုဖြင့်သာ ပြောင်းနိုင်သည်။',
  restaurant_modal_form_note: 'ဆိုင်အမည်နှင့် လိပ်စာသစ် ထည့်ပါ။ အက်ဒမင် တစ်ဦးက စစ်ဆေးပြီး ခွင့်ပြုမည်။',
  restaurant_next_upload_docs: 'နောက် → စာရွက်စာတမ်း တင်ရန်',
  restaurant_creating: 'ဖန်တီးနေသည်…',
  restaurant_modal_docs_note: 'ဤပြောင်းလဲမှုကို ခွင့်ပြုရန် သင်၏ အထောက်အထားကို စစ်ဆေးပါ။ မူရင်း စာရွက်စာတမ်းများ သုံးနိုင်သည် သို့မဟုတ် အသစ် တင်နိုင်သည်။',
  restaurant_doc_ready: '✓ အဆင်သင့်',
  restaurant_submit_review: 'စစ်ဆေးရန် တင်ပြ',
  restaurant_submitting: 'တင်ပြနေသည်…',
  restaurant_submitted_note: 'သင်၏ တောင်းဆိုမှု တင်ပြပြီးပါပြီ။ အက်ဒမင်က စစ်ဆေးပြီး ခွင့်ပြု သို့မဟုတ် ငြင်းပယ်မည်။ ရလဒ် အကြောင်းကြားခြင်း ခံရမည်။',
  common_replace: 'အစားထိုး',
  // KYC Steps
  kyc_step1_title: 'စီးပွားရေး သတင်းအချက်အလက်',
  kyc_step1_business_name: 'စီးပွားရေး နာမည်',
  kyc_step1_business_type: 'စီးပွားရေး အမျိုးအစား',
  kyc_step1_business_address: 'စီးပွားရေး လိပ်စာ',
  kyc_step1_business_phone: 'စီးပွားရေး ဖုန်းနံပါတ်',
  kyc_step1_continue: 'ဆက်လက်ရန်',
  kyc_step1_phone_error: 'ဖုန်းနံပါတ်သည် ဂဏန်း ၁၀ လုံး ဖြစ်ရမည်',
  kyc_step2_title: 'လိုအပ်သော စာရွက်စာတမ်းများ',
  kyc_step2_subtitle: 'ဆက်လက်ရန် စာရွက်စာတမ်း ၄ ခုလုံး တင်ပါ',
  kyc_step2_submit: 'လျှောက်လွှာ တင်ပြရန်',
  kyc_step2_reupload: 'ပြန်တင်ရန်',
  kyc_doc_national_id_desc: 'နိုင်ငံသားစိစစ်ရေးကတ် ရှေ့နောက်',
  kyc_doc_business_reg_desc: 'စီးပွားရေး မှတ်ပုံတင် လက်မှတ်',
  kyc_doc_bank_book_desc: 'ဘဏ်စာအုပ် ပထမစာမျက်နှာ',
  kyc_doc_storefront_desc: 'ဆိုင်ပြင်ပ ဓာတ်ပုံ',
  kyc_step3_title: 'လျှောက်လွှာ တင်ပြပြီး!',
  kyc_step3_body: 'သင်၏ လျှောက်လွှာကို စစ်ဆေးနေသည်။ စစ်ဆေးမှု ပြီးဆုံးပါက ၁–၂ ရက်အတွင်း အကြောင်းကြားမည်။',
  kyc_step3_info: 'သင်၏ အကောင့် ခွင့်ပြုသောအခါ အီးမေးလ် အကြောင်းကြားချက် ရရှိမည်။',
  // KYC Pending
  kyc_pending_title: 'လျှောက်လွှာ အခြေအနေ',
  kyc_pending_submitted: 'တင်ပြသည်:',
  kyc_pending_review_note: 'သင်၏ လျှောက်လွှာကို စစ်ဆေးနေသည်။ ကျွန်ုပ်တို့အဖွဲ့ ၁–၂ ရက်အတွင်း ပြန်ဆက်မည်။',
  kyc_pending_rejection_title: 'ငြင်းပယ်သည့် အကြောင်းပြချက်:',
  kyc_pending_rejection_help: 'ပြဿနာများ ပြင်ဆင်ပြီး ပြန်တင်နိုင်သည် သို့မဟုတ် ပံ့ပိုးမှု အဖွဲ့ကို ဆက်သွယ်နိုင်သည်။',
  kyc_pending_resubmit: 'လျှောက်လွှာ ပြန်တင်ရန်',
  kyc_pending_contact_support: 'ပံ့ပိုးမှု ဆက်သွယ်ရန်',
  // KYC
  kyc_log_out: 'ထွက်ခြင်း',
  kyc_doc_national_id: 'နိုင်ငံသားစိစစ်ရေးကတ်',
  kyc_doc_business_reg: 'စီးပွားရေးမှတ်ပုံတင်',
  kyc_doc_bank_book: 'ဘဏ်စာအုပ်',
  kyc_doc_storefront: 'ဆိုင်ရှေ့ ဓာတ်ပုံ',
  // OTP Login
  otp_phone_label: 'ဖုန်းနံပါတ်',
  otp_send_code: 'OTP ကုဒ် ပို့ရန်',
  otp_code_sent_to: 'ကုဒ် ပို့ပြီး',
  otp_verify_sign_in: 'စစ်ဆေး & ဝင်ရောက်ရန်',
  otp_phone_login_title: 'ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ရန်',
  otp_enter_otp_title: 'OTP ထည့်ရန်',
  otp_send_pin_subtitle: 'တစ်ကြိမ်သုံး PIN ပို့ပေးမည်',
  otp_check_messages: 'သင့်မက်ဆေ့များ စစ်ဆေးပါ',
  otp_sent_one_time_pin: 'ဖုန်းနံပါတ်သို့ တစ်ကြိမ်သုံး PIN ပို့မည်',
  otp_enter_phone_tagline: 'ဝင်ရောက်ရေး ကုဒ် ရရှိရန် ဖုန်းနံပါတ် ထည့်ပါ',
  otp_enter_digit_code: '-ဂဏန်းကုဒ်',
  // Register
  register_full_name: 'နာမည်',
  register_email_address: 'အီးမေးလ် လိပ်စာ',
  register_password: 'စကားဝှက်',
  register_password_hint: 'အနည်းဆုံး ၈ လုံး · အကြီး · အသေး · နံပါတ်',
  register_send_code: 'စစ်ဆေးရေး ကုဒ် ပို့ရန်',
  register_note: 'မှတ်ပုံတင်ပြီးနောက် သင့်ဆိုင် တည်ဆောက်ရန် KYC စစ်ဆေးမှု ပြီးမြောက်ရမည်။',
  register_verify_create: 'စစ်ဆေး & အကောင့် ဖန်တီးရန်',
  register_edit_details: '← အသေးစိတ် ပြောင်းရန်',
  register_resend_code: 'ကုဒ် ပြန်ပို့ရန်',
  register_verify_email_title: 'အီးမေးလ် စစ်ဆေးရန်',
  register_create_account_title: 'အကောင့် ဖန်တီးရန်',
  register_create_subtitle: 'MOi Order ဖြင့် ရောင်းချရန် မှတ်ပုံတင်ပါ',
  // Business Profile
  biz_title: 'စီးပွားရေး ပရိုဖိုင်',
  biz_email_not_verified: 'အီးမေးလ် မစစ်ဆေးရသေး',
  biz_tap_to_verify: 'အီးမေးလ် စစ်ဆေးရန်နှင့် စကားဝှက် သတ်မှတ်ရန် နှိပ်ပါ။',
  biz_account: 'အကောင့်',
  biz_unverified: 'မစစ်ဆေးရသေး',
  biz_verified: 'စစ်ဆေးပြီး',
  biz_add_email: 'အီးမေးလ် လိပ်စာ ထည့်ရန်',
  biz_verify_email_password: 'အီးမေးလ် စစ်ဆေး & စကားဝှက် သတ်မှတ်ရန်',
  biz_verification_docs: 'စစ်ဆေးရေး စာရွက်စာတမ်းများ',
  biz_failed_load: 'ပရိုဖိုင် ဖတ်မရပါ',
  // Cashout / Invoice
  cashout_eyebrow: 'ငွေထုတ်',
  cashout_title: 'နေ့စဉ် ငွေစာရင်း',
  cashout_period_today: 'ယနေ့',
  cashout_period_week: 'ဤသီတင်းပတ်',
  cashout_period_month: 'ဤလ',
  cashout_section_today: 'ယနေ့',
  cashout_section_history: 'မှတ်တမ်း',
  cashout_qr_upload: 'QR တင်ရန်',
  cashout_qr_replace: 'QR အစားထိုးရန်',
  cashout_qr_uploading: 'တင်နေသည်…',
  cashout_qr_saved: '✓ QR သိမ်းပြီး',
  cashout_load_more: 'ပိုမိုကြည့်ရန်',
  cashout_no_invoices: 'ယခင် ငွေစာရင်း မရှိသေးပါ။',
  cashout_no_week: 'ဤသီတင်းပတ်အတွက် ဒေတာ မရှိသေးပါ။',
  cashout_no_month: 'ဤလအတွက် ဒေတာ မရှိသေးပါ။',
  cashout_orders: 'အော်ဒါများ',
  cashout_customer_total: 'ဖောက်သည် စုစုပေါင်း',
  cashout_platform_fee: 'ပလက်ဖောင်း ကြေး (၅%)',
  cashout_payout: 'သင့်ရငွေ',
};

export const TRANSLATIONS: Record<Language, Translations> = { en: EN, my: MY };
